import Joi from "joi";
import { IOrder } from "../models/order.model";

export const orderValidate = (data: IOrder) => {
  const orderSchema = Joi.object({
    userId: Joi.string().required(),
    cartId: Joi.string().required(),
    shipping: Joi.object().required(),
    payment: Joi.object().required(),
    products: Joi.array().required(),
  });
  return orderSchema.validate(data);
};
