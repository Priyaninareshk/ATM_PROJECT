import express from "express";
import { body } from "express-validator";
import { deposit, getTransactions, withdraw } from "../controllers/transactionController.js";
import { authMiddleware, enforceAccountOwnership } from "../middleware/authMiddleware.js";

const router = express.Router();

const amountValidator = body("amount")
  .isFloat({ gt: 0 })
  .withMessage("Amount must be a number greater than 0")
  .toFloat();

router.post("/deposit", authMiddleware, amountValidator, deposit);
router.post("/withdraw", authMiddleware, amountValidator, withdraw);
router.get("/:id", authMiddleware, enforceAccountOwnership, getTransactions);

export default router;
