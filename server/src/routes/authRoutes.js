import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import { login, logout, me, signup } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

const pinValidator = body("pin")
  .trim()
  .matches(/^\d{4}$/)
  .withMessage("PIN must be exactly 4 digits");

router.post(
  "/signup",
  authLimiter,
  body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2 to 60 characters"),
  pinValidator,
  body("confirmPin").trim().matches(/^\d{4}$/).withMessage("Confirm PIN must be exactly 4 digits"),
  signup
);

router.post("/login", authLimiter, pinValidator, login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);

export default router;
