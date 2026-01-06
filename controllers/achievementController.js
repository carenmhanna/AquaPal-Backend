import Achievement from "../models/achievement.js";

export const getAchievements = async (req, res) => {
  try {
    const items = await Achievement.find().lean();
    res.json(items);
  } catch (err) {
    console.error("getAchievements", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAchievementById = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Achievement not found" });
    res.json(item);
  } catch (err) {
    console.error("getAchievementById", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAchievement = async (req, res) => {
  try {
    const { badgeName, description, waterSavedLiters, iconUrl } = req.body;
    if (!badgeName || waterSavedLiters == null) return res.status(400).json({ message: "Missing required fields" });
    const a = new Achievement({ badgeName, description, waterSavedLiters, iconUrl });
    await a.save();
    res.status(201).json(a);
  } catch (err) {
    console.error("createAchievement", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAchievement = async (req, res) => {
  try {
    const updates = (({ badgeName, description, waterSavedLiters, iconUrl }) => ({
      badgeName,
      description,
      waterSavedLiters,
      iconUrl,
    }))(req.body);
    const item = await Achievement.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Achievement not found" });
    res.json(item);
  } catch (err) {
    console.error("updateAchievement", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const item = await Achievement.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Achievement not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteAchievement", err);
    res.status(500).json({ message: "Server error" });
  }
};