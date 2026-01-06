import ActivityOption from "../models/activityOption.js";
import Activity from "../models/activity.js";

export const getActivityOptions = async (req, res) => {
  try {
    const opts = await ActivityOption.find().populate("activityId").lean();
    res.json(opts);
  } catch (err) {
    console.error("getActivityOptions", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getActivityOptionById = async (req, res) => {
  try {
    const opt = await ActivityOption.findById(req.params.id).populate("activityId").lean();
    if (!opt) return res.status(404).json({ message: "Activity option not found" });
    res.json(opt);
  } catch (err) {
    console.error("getActivityOptionById", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOptionsByActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    // optional: verify activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    const opts = await ActivityOption.find({ activityId }).lean();
    res.json(opts);
  } catch (err) {
    console.error("getOptionsByActivity", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createActivityOption = async (req, res) => {
  try {
    const { activityId, optionName, averageDurationMin, waterQuantityLiters } = req.body;
    if (!activityId || !optionName || averageDurationMin == null || waterQuantityLiters == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const opt = new ActivityOption({ activityId, optionName, averageDurationMin, waterQuantityLiters });
    await opt.save();
    res.status(201).json(opt);
  } catch (err) {
    console.error("createActivityOption", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateActivityOption = async (req, res) => {
  try {
    const updates = (({ optionName, averageDurationMin, waterQuantityLiters, activityId }) => ({
      optionName,
      averageDurationMin,
      waterQuantityLiters,
      activityId,
    }))(req.body);

    const opt = await ActivityOption.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!opt) return res.status(404).json({ message: "Activity option not found" });
    res.json(opt);
  } catch (err) {
    console.error("updateActivityOption", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteActivityOption = async (req, res) => {
  try {
    const opt = await ActivityOption.findByIdAndDelete(req.params.id);
    if (!opt) return res.status(404).json({ message: "Activity option not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteActivityOption", err);
    res.status(500).json({ message: "Server error" });
  }
};