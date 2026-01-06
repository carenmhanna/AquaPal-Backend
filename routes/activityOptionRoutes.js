import express from "express";
import {
  getActivityOptions,
  getActivityOptionById,
  getOptionsByActivity,
  updateActivityOption,
  deleteActivityOption,
} from "../controllers/activityOptionController.js";
import protect from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getActivityOptions);
router.get("/:id", getActivityOptionById);
router.get("/activity/:activityId", getOptionsByActivity);

// protected admin routes (if you later expose them)
router.put("/:id", protect, requireRole(["admin"]), updateActivityOption);
router.delete("/:id", protect, requireRole(["admin"]), deleteActivityOption);

export default router;