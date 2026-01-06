import express from "express";
import { registerUser, loginUser, getProfile, updateProfile } from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import { deleteAccount } from "../controllers/userController.js";


const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected (requires Authorization: Bearer <token>)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/delete", protect, deleteAccount);


export default router;