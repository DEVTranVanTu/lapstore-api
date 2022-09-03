import Joi from "joi";
import { IUser } from "../models/user.model";

export const userValidate = (data: IUser) => {
  const userSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    username: Joi.string().lowercase(),
    password: Joi.string().min(3).max(12).required(),
    profile: Joi.object(),
    authGoogleID: Joi.string(),
    authFbID: Joi.string(),
    authType: Joi.string(),
    role: Joi.string(),
    verified: Joi.boolean(),
  });
  return userSchema.validate(data);
};
