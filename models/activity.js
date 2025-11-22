import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  activityName: { type: String, required: true }
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;