import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { generateAccountNumber } from "../utils/authUtils.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  const pinHash = await bcrypt.hash(process.env.SEED_DEMO_PIN || "1234", 10);
  const existing = await User.findOne({ name: process.env.SEED_DEMO_NAME || "Demo User" });
  if (existing) {
    console.log("Demo user already exists.");
    process.exit(0);
  }

  const user = await User.create({
    name: process.env.SEED_DEMO_NAME || "Demo User",
    accountNumber: generateAccountNumber(),
    pinHash,
    balance: Number(process.env.SEED_DEMO_BALANCE || 1000)
  });

  console.log("Demo user created:", {
    id: user._id.toString(),
    name: user.name,
    accountNumber: user.accountNumber,
    pin: process.env.SEED_DEMO_PIN || "1234"
  });
  process.exit(0);
};

seed();
