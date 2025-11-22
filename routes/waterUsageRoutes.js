import express from "express";
import protect from "../middleware/auth.js";
import {
  createLog,
  getUserLogs,
  getLogById,
  deleteLog,
} from "../controllers/waterUsageController.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createLog);        // create a log (and update user's waterSaved)
router.get("/", protect, getUserLogs);       // get all logs for authenticated user
router.get("/:id", protect, getLogById);     // get single log (owner only)
router.delete("/:id", protect, deleteLog);   // delete a log (owner only)

export default router;