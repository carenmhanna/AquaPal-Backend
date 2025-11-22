import mongoose from "mongoose";

const activityOptionSchema = new mongoose.Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true },
  optionName: { type: String, required: true }, // e.g. "Super Quick", "Quick", "Normal", "Long"
  averageDurationMin: { type: Number, required: true },
  waterQuantityLiters: { type: Number, required: true }
});

const ActivityOption = mongoose.model("ActivityOption", activityOptionSchema);
export default ActivityOption;