import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { roles } from "../utils/constants";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  profile: object;
  authGoogleID: string;
  authFbID: string;
  authType: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      lowercase: true,
      require: true,
    },
    profile: {
      type: Object,
      dateofbirth: { type: Date },
      phoneNumber: { type: String },
      photo: { type: String },
      location: { type: String },
    },
    authType: {
      type: String,
      enum: ["gmail", "google", "facebook"],
      default: "gmail",
    },
    authGoogleID: {
      type: String,
      default: null,
    },
    authFbID: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: [roles.ROLE_CUSTOMER, roles.ROLE_ADMIN],
      default: roles.ROLE_CUSTOMER,
    },
    verified: { type: Boolean },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
export default mongoose.model<IUser>("User", UserSchema);
