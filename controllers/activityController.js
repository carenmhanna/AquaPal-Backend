import Activity from "../models/activity.js";

export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().lean();
    res.json(activities);
  } catch (err) {
    console.error("getActivities", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).lean();
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (err) {
    console.error("getActivityById", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createActivity = async (req, res) => {
  try {
    const { activityName } = req.body;
    if (!activityName) return res.status(400).json({ message: "activityName is required" });

    const a = new Activity({ activityName });
    await a.save();
    res.status(201).json(a);
  } catch (err) {
    console.error("createActivity", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { activityName } = req.body;
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { activityName },
      { new: true, runValidators: true }
    );
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (err) {
    console.error("updateActivity", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteActivity", err);
    res.status(500).json({ message: "Server error" });
  }
};