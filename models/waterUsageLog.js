import mongoose from "mongoose";

const waterUsageLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  usageTime: { type: Date, required: true, default: Date.now },
  activityOptionId: { type: mongoose.Schema.Types.ObjectId, ref: "ActivityOption", required: true }
}, { timestamps: true });

const WaterUsageLog = mongoose.model("WaterUsageLog", waterUsageLogSchema);
export default WaterUsageLog;