import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    accountNumber: { type: String, required: true, unique: true, index: true },
    pinHash: { type: String, required: true },
    balance: { type: Number, required: true, min: 0, default: 0 }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
