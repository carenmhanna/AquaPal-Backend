import WaterUsageLog from "../models/waterUsageLog.js";
import ActivityOption from "../models/activityOption.js";
import User from "../models/user.js";
import mongoose from "mongoose";

// Create a new water usage log and update user's waterSaved
export const createLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityOptionId, usageTime } = req.body;

    if (!activityOptionId || !mongoose.Types.ObjectId.isValid(activityOptionId)) {
      return res.status(400).json({ message: "Valid activityOptionId is required" });
    }

    const activityOption = await ActivityOption.findById(activityOptionId);
    if (!activityOption) return res.status(404).json({ message: "Activity option not found" });

    const log = await WaterUsageLog.create({
      userId,
      activityOptionId,
      usageTime: usageTime ? new Date(usageTime) : undefined,
    });

    // increment user's waterSaved by the option's waterQuantityLiters
    const increment = Number(activityOption.waterQuantityLiters) || 0;
    if (increment !== 0) {
      await User.findByIdAndUpdate(userId, { $inc: { waterSaved: increment } }, { new: true });
    }

    const populated = await WaterUsageLog.findById(log._id)
      .populate("activityOptionId", "optionName waterQuantityLiters averageDurationMin")
      .populate("userId", "firstName lastName email");

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get logs for the authenticated user
export const getUserLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await WaterUsageLog.find({ userId })
      .populate("activityOptionId", "optionName waterQuantityLiters averageDurationMin")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single log by id (must belong to the authenticated user)
export const getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const log = await WaterUsageLog.findById(id)
      .populate("activityOptionId", "optionName waterQuantityLiters averageDurationMin")
      .populate("userId", "firstName lastName email");
    if (!log) return res.status(404).json({ message: "Log not found" });

    if (log.userId._id.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    res.json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: delete a user's log (and optionally decrement waterSaved)
// This will only allow the owner to delete.
export const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const log = await WaterUsageLog.findById(id);
    if (!log) return res.status(404).json({ message: "Log not found" });
    if (log.userId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const activityOption = await ActivityOption.findById(log.activityOptionId);
    const decrement = activityOption ? Number(activityOption.waterQuantityLiters) || 0 : 0;

await log.deleteOne();

    if (decrement !== 0) {
      // ensure waterSaved doesn't go negative
      const user = await User.findById(req.user.id);
      user.waterSaved = Math.max(0, (user.waterSaved || 0) - decrement);
      await user.save();
    }

    res.json({ message: "Log deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};