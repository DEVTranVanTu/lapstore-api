import mongoose, { Schema } from "mongoose";

const TokenSchema: Schema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: { type: String, required: true },
  mode: { type: String, required: false, default: "user" },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
});

export default mongoose.model("Token", TokenSchema);
