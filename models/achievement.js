import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  badgeName: { type: String, required: true },
  description: { type: String },
  waterSavedLiters: { type: Number, required: true },
  iconUrl: { type: String }
});

const Achievement = mongoose.model("Achievement", achievementSchema);
export default Achievement;