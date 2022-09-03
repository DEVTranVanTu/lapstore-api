import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import userService from "../services/user.service";
import { HttpStatusCode } from "../utils/constants";
import { userValidate } from "../validations";

const verifyEmail = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({
      status: "failed!",
      message: "email, username or password is invalid!",
    });
  }
  await userService.verifyEmail(req, res);
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    let user = await userModel.find({ email });
    if (user.length > 0) {
      return res
        .status(422)
        .send({ error: "That username or email address is already in use." });
    }
    await userService.register(req, res);
  } catch (error) {
    return next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email } = req.body;
  try {
    const { error } = userValidate(req.body);
    if (error) {
      return res.status(400).send({
        error: "username email or password is invalid!",
      });
    } else {
      let user = await userModel.findOne({
        $or: [{ email }, { username }],
      });
      if (!user) {
        return res
          .status(401)
          .json({ error: "No user with the email or username" });
      } else {
        let user = await userModel.findOne({
          $or: [{ email }, { username }],
        });
        if (!user) {
          return res
            .status(401)
            .json({ error: "No user with the email or username" });
        } else {
          await userService.login(req, res);
        }
      }
    }
  } catch (error) {
    return next(error);
  }
};

const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers(req);
    return res.status(200).send(users);
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(error.status).json({ message: error.message });
    }
  }
};

const viewProfile = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    if (id) {
      await userService.viewProfile(req, res, next);
    } else {
      return res.status(400).send({
        error: "account is invalid!",
      });
    }
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const check = await userModel.findById(id);
    if (id && check) {
      await userService.updateProfile(req, res);
    } else {
      return res.status(400).send({
        error: "account is invalid!",
      });
    }
  } catch (error) {
    return next(error);
  }
};

const checkTokenExpired = async (req: Request, res: Response) => {
  try {
    const token = await userService.checkTokenExpired(req.params.id);
    res.status(200).send(token);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default {
  register,
  login,
  listUsers,
  viewProfile,
  updateProfile,
  verifyEmail,
  checkTokenExpired,
};
