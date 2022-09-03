import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: String;
  otp: String;
  time: Date;
}

const optSchema: Schema = new Schema({
  email: String,
  otp: String,
  time: {
    type: Date,
    default: Date.now,
    index: {
      expires: 100,
    },
  },
});

export default mongoose.model<IOtp>("otp", optSchema);
