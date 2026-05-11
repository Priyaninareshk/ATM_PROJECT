import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";

const formatValidationErrors = (errors) => errors.array().map((e) => e.msg).join(", ");

const runTransaction = async ({ userId, amount, type }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      const err = new Error("Account not found");
      err.statusCode = 404;
      throw err;
    }

    if (type === "withdraw" && user.balance < amount) {
      const err = new Error("Insufficient funds");
      err.statusCode = 400;
      throw err;
    }

    user.balance = type === "deposit" ? user.balance + amount : user.balance - amount;
    await user.save({ session });

    await Transaction.create(
      [
        {
          userId,
          type,
          amount,
          balanceAfter: user.balance
        }
      ],
      { session }
    );

    await session.commitTransaction();
    return user.balance;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const deposit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: formatValidationErrors(errors) });
    }

    const { amount } = req.body;
    const balance = await runTransaction({ userId: req.userId, amount: Number(amount), type: "deposit" });
    return res.json({ message: "Deposit successful", balance });
  } catch (error) {
    return next(error);
  }
};

export const withdraw = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: formatValidationErrors(errors) });
    }

    const { amount } = req.body;
    const balance = await runTransaction({ userId: req.userId, amount: Number(amount), type: "withdraw" });
    return res.json({ message: "Withdrawal successful", balance });
  } catch (error) {
    return next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("type amount balanceAfter createdAt");

    return res.json({ transactions });
  } catch (error) {
    return next(error);
  }
};
