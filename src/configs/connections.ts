import mongoose from "mongoose";
import { env } from "./environments";
export const connectDB = async () => {
  await mongoose.connect(env.MONGODB_URI);
};
