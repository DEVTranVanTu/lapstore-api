import mongoose from "mongoose";
import { env } from "./environments";
export const connectDB = async () => {
  // mongoose.set("debug", true);
  await mongoose.connect(env.MONGODB_URI);
};
