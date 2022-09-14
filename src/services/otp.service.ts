import bcrypt from "bcryptjs";
import otpModel from "../models/otp.model";

const insertOtp = async (email: string, otp: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(otp, salt);
    const OTP = await otpModel.create({
      email,
      otp: hashOtp,
    });
    return OTP;
  } catch (error) {
    console.log(error);
  }
};

const validOtp = async (otp: string, hashOtp: string) => {
  try {
    const isValid = await bcrypt.compare(otp, hashOtp);
    return isValid;
  } catch (error) {
    console.log(error);
  }
};

export default {
  insertOtp,
  validOtp,
};
