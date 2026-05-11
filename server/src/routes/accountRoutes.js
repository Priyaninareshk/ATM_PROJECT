import express from "express";
import { getAccount } from "../controllers/accountController.js";
import { authMiddleware, enforceAccountOwnership } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", authMiddleware, enforceAccountOwnership, getAccount);

export default router;
