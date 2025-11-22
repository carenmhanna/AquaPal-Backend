import express from "express";
import { registerUser, loginUser, getProfile, updateProfile } from "../controllers/userController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected (requires Authorization: Bearer <token>)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;