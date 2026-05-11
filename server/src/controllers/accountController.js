import { User } from "../models/User.js";

export const getAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("name accountNumber balance");
    if (!user) return res.status(404).json({ message: "Account not found" });
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
};
