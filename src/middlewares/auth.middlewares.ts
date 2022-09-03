import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import tokenModel from "../models/token.model";
import userModel from "../models/user.model";
import { env } from "../configs/environments";
import helpers from "../utils/helpers";

const generateToken = (user: Object) => {
  return jwt.sign(user, env.ACCESS_TOKEN_SECRET, {
    expiresIn: 604800,
  });
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "") || "";
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    const value = await tokenModel.findOne({
      _userId: decoded._id,
      token: token,
    });

    if (!value) {
      throw new Error();
    }
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate!" });
  }
};

const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;
  try {
    const t = await tokenModel.findOne({ token });
    if (!t) {
      res.status(201).json({
        message: "Invalid token for email verification",
      });
      return;
    }
    let result = await userModel.findById(t._userId);
    if (!result) {
      res.status(201).json({
        message: "Invalid token for email verification",
      });
      return;
    }
    if (result.verified) {
      res.status(201).json({
        message: "The account has already been verified",
      });
      return;
    }
    result.verified = true;
    result.save();
    res.status(201).json({
      message: "The account has been verified successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const authGoogleSuccess = (req: any, res: any, next: any) => {
  const userInfo = helpers.setUserInfo(req.user);
  const token = `${generateToken(userInfo)}`;
  const id = userInfo._id;
  return res.redirect(
    302,
    `${env.SUCCESS_CALLBACK_URL}?token=${token}&id=${id}`
  );
};

export default { generateToken, confirmEmail, verifyToken, authGoogleSuccess };
