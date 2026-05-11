import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { createToken, generateAccountNumber, getCookieOptions } from "../utils/authUtils.js";

const formatValidationErrors = (errors) => errors.array().map((e) => e.msg).join(", ");

export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: formatValidationErrors(errors) });
    }

    const { name, pin, confirmPin } = req.body;
    if (pin !== confirmPin) {
      return res.status(400).json({ message: "PIN and confirm PIN must match" });
    }

    const pinHash = await bcrypt.hash(pin, 10);
    const user = await User.create({
      name: name.trim(),
      accountNumber: generateAccountNumber(),
      pinHash,
      balance: 0
    });

    const token = createToken(user._id.toString());
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        accountNumber: user.accountNumber,
        balance: user.balance
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Account generation conflict. Please retry." });
    }
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: formatValidationErrors(errors) });
    }

    const { pin } = req.body;
    const users = await User.find({}).sort({ createdAt: 1 });
    if (!users.length) {
      return res.status(404).json({ message: "No account found. Please sign up first." });
    }

    let matchedUser = null;
    for (const candidate of users) {
      const isValidPin = await bcrypt.compare(pin, candidate.pinHash);
      if (isValidPin) {
        matchedUser = candidate;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    const token = createToken(matchedUser._id.toString());
    res.cookie("token", token, getCookieOptions());

    return res.json({
      message: "Login successful",
      user: {
        id: matchedUser._id,
        name: matchedUser.name,
        accountNumber: matchedUser.accountNumber,
        balance: matchedUser.balance
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("name accountNumber balance");
    if (!user) return res.status(404).json({ message: "Account not found" });
    return res.json({ user: { ...user.toObject(), id: user._id } });
  } catch (error) {
    return next(error);
  }
};

export const logout = (_req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax"
  });
  return res.json({ message: "Logged out successfully" });
};
