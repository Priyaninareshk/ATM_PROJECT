import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

export const enforceAccountOwnership = (req, res, next) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ message: "Forbidden: account access denied" });
  }
  return next();
};
