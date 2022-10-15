import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import userModel from "../models/user.model";
import Helper from "../utils/helpers";
import tokenModel from "../models/token.model";
import { roles } from "../utils/constants";
import auth from "../middlewares/auth.middlewares";
import otpModel from "../models/otp.model";
import otpService from "./otp.service";
import { env } from "../configs/environments";
import { OAuth2Client } from "google-auth-library";

const verifyEmail = async (req: Request, res: Response) => {
  const { email, username, password, otp, role } = req.body;
  try {
    const otpHolder = await otpModel.find({ email });
    if (!otpHolder.length) {
      return res.status(404).json({
        status: "Bad request",
        message: "Expired OTP!",
      });
    }
    const lastOtp = otpHolder[otpHolder.length - 1];
    const otpParams = lastOtp.otp.toString();
    const isValid = await otpService.validOtp(otp, otpParams);
    if (!isValid) {
      return res.status(401).json({
        status: "faild",
        message: "Invalid OTP!",
      });
    }
    if (isValid && email === lastOtp.email) {
      const user = new userModel({
        email,
        password,
        username,
        role: role === "admin" ? roles.ROLE_ADMIN : roles.ROLE_CUSTOMER,
      });

      const usr = await user.save();
      const userInfo = Helper.setUserInfo(usr);
      const token = new tokenModel({
        _userId: userInfo._id,
        token: auth.generateToken(userInfo),
      });
      await token.save();

      return res.status(201).json({
        status: "Ok",
        user: userInfo,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const register = async (req: Request, res: Response) => {
  const { email } = req.body;

  const num = Math.floor(Math.random() * (99999 - 10000) + 10000);
  const otp = num.toString();

  if (!email) {
    return res.status(404).json({
      status: "failed!",
      message: "Email is invalid!",
    });
  }
  const insertOtp = await otpService.insertOtp(email, otp);
  if (!insertOtp) {
    return res.status(404).json({
      status: "failed!",
      message: "Error! An error occurred. Please try again later",
    });
  }
  // Khởi tạo OAuth2Client với Client ID và Client Secret
  const myOAuth2Client = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET
  );
  // Set Refresh Token vào OAuth2Client Credentials
  myOAuth2Client.setCredentials({
    refresh_token: env.GOOGLE_REFRESH_TOKEN,
  });

  const myAccessTokenObject = await myOAuth2Client.getAccessToken();
  // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
  const myAccessToken = myAccessTokenObject?.token;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: env.ADMIN_EMAIL_ADDRESS,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      accessToken: myAccessToken,
    },
  });
  // mailOption là những thông tin gửi từ phía client lên thông qua API
  const mailOptions = {
    to: email,
    subject: "Send OTP",
    html: `<h3>${otp}</h3>`,
  };

  try {
    // Gọi hành động gửi email
    await transport.sendMail(mailOptions);
    // Không có lỗi gì thì trả về success
    res.status(200).json({ message: "Email sent successfully." });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  let user = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (user) {
    const userPassword = user?.password || "";
    const isMatch = await bcrypt.compare(password, userPassword);
    if (!isMatch) {
      return res.status(401).json({
        message: "Password mismatch",
      });
    }
    const userInfo = Helper.setUserInfo(user);

    await tokenModel.findOneAndDelete({ _userId: user._id });

    let result = {
      token: auth.generateToken(userInfo),
      user: userInfo,
    };
    const token = new tokenModel({
      _userId: userInfo._id,
      token: auth.generateToken(userInfo),
    });
    await token.save();
    return res.status(200).json({
      status: "Success",
      data: result,
    });
  }
};

const getUsers = async (req: Request) => {
  let users = null;
  let page: any = req.query.page;
  let limit: any = req.query.limit;
  let search: any = req.query.search;

  let searchInput: string;

  if (search && search.trim().length > 0) {
    searchInput = search;
  } else {
    searchInput = "";
  }

  if (page && limit) {
    const pages = parseInt(page);
    const limits = parseInt(limit);
    const skip = pages * limits - limits;
    const totals = await userModel
      .find({
        username: { $regex: ".*" + searchInput + ".*", $options: "i" },
      })
      .countDocuments({})
      .then((total) => total);
    await userModel
      .find({
        username: { $regex: ".*" + searchInput + ".*", $options: "i" },
      })
      .skip(skip)
      .limit(limits)
      .then((data) => {
        if (!data) {
          throw {
            status: 404,
            success: false,
            message: "Users not found",
          };
        } else {
          users = {
            data: data,
            pagination: {
              totalRows: data.length,
              page: page,
              totals: totals,
              totalPages: Math.ceil(totals / limit),
            },
          };
        }
      })
      .catch((error) => {
        throw {
          status: error.status || 500,
          success: false,
          message: error.message,
        };
      });
  } else {
    await userModel
      .find()
      .then((data) => {
        if (!data) {
          throw {
            status: 404,
            success: false,
            message: "list users not found!",
          };
        } else {
          users = data;
        }
      })
      .catch((error) => {
        throw {
          status: error.status || 500,
          success: false,
          message: error.message,
        };
      });
  }
  return users;
};

const viewProfile = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  try {
    let user = await userModel.findById(userId);
    if (user) {
      const userToReturn = Helper.setUserInfo(user);
      return res.status(200).json({ user: userToReturn });
    }
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    let profile = req.body.profile;
    delete profile.email;
    delete profile.username;

    await userModel.findByIdAndUpdate(
      req.params.id,

      { profile },
      {
        new: true,
      }
    );
    let user = await userModel.findById(req.params.id);
    res.send({ user });
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

const getAllAdmin = async () => {
  let admins = null;
  await userModel
    .find({ role: "Admin" })
    .then((data) => (admins = data))
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return admins;
};

const checkTokenExpired = async (id: string) => {
  let tokendata = null;
  await tokenModel
    .findOne({ _userId: id })
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Token not found",
        };
      } else {
        tokendata = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return tokendata;
};

export default {
  register,
  login,
  getUsers,
  viewProfile,
  updateProfile,
  verifyEmail,
  checkTokenExpired,
  getAllAdmin,
};
