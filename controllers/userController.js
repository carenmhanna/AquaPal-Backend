import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import dotenv from "dotenv";
import admin from "../firebaseAdmin.js"; // ✅ YOU MUST ADD THIS
import WaterUsageLog from "../models/waterUsageLog.js";
dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      SchoolName,
      ageGroup,
      gender,
      country,
      email,
      phoneNumber,
      password,
      waterBuddy, // <-- accept waterBuddy from client
    } = req.body;

    // Validate waterBuddy if provided
    const ALLOWED_BUDDIES = ["coral", "luna", "splash"];
    const buddyValue = ALLOWED_BUDDIES.includes(String(waterBuddy || "").toLowerCase())
      ? String(waterBuddy).toLowerCase()
      : undefined;

    // normalize phone and email
    const normalizedPhone = (phoneNumber || "").toString().replace(/\s+/g, "");
    const normalizedEmail = (email || "").toString().toLowerCase().trim();

    if (!firstName || !lastName || !ageGroup || !gender || !country || !normalizedEmail || !normalizedPhone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ $or: [{ email: normalizedEmail }, { phoneNumber: normalizedPhone }] });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const user = new User({
      firstName,
      lastName,
      SchoolName,
      ageGroup,
      gender,
      country,
      email: normalizedEmail,
      phoneNumber: normalizedPhone,
      password, // will be hashed in pre-save hook
      ...(buddyValue ? { waterBuddy: buddyValue } : {}),
    });

    await user.save();

    const out = user.toObject();
    delete out.password;
    res.status(201).json({ user: out, token: generateToken(user._id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, phoneNumber, firebaseToken } = req.body;

    // Make sure we got the firebase token
    if (!firebaseToken || (!email && !phoneNumber)) {
      return res.status(400).json({ message: "Email/phone + Firebase token required" });
    }

    // 1️⃣ Verify Firebase token (this proves password was correct)
    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    // 2️⃣ Find user by email (preferred)
    let user;
    if (email) {
      const normalizedEmail = String(email).toLowerCase().trim();
      user = await User.findOne({ email: normalizedEmail });

      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      // Safety check — Firebase email must match DB email
      if (decoded.email !== user.email) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      // Phone login (optional future case)
      const raw = String(phoneNumber).trim();
      const normalized = raw.replace(/\s+/g, "");
      user = await User.findOne({ phoneNumber: { $in: [raw, normalized] } });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Build the SAME response as before
    const payload = {
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      waterBuddy: user.waterBuddy,
      ageGroup: user.ageGroup,
    };

    // 4️⃣ Return SAME JWT token your whole app uses
    return res.json({
      user: payload,
      token: generateToken(user._id),
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
};


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Only allow specific fields to be updated
    const allowed = ["firstName", "lastName", "SchoolName", "ageGroup", "gender", "country", "phoneNumber", "waterBuddy", "password", "waterSaved", "achievements"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) user[key] = req.body[key];
    }

    // Use save() so pre("save") hook hashes password when changed
    await user.save();

    const result = user.toObject();
    delete result.password;

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// userController.js
export const deleteAccount = async (req, res) => {
  try {
    console.log("DeleteAccount req.user:", req.user);

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Deleting user:", user.email);

    // Delete WaterUsageLogs
    await WaterUsageLog.deleteMany({ userId });

    // Delete from Firebase safely
    try {
      const firebaseUser = await admin.auth().getUserByEmail(user.email);
      if (firebaseUser) {
        await admin.auth().deleteUser(firebaseUser.uid);
      }
    } catch (firebaseErr) {
      console.warn("Firebase user deletion failed (maybe user not found):", firebaseErr.message);
    }

    // Delete user from MongoDB
    await user.deleteOne();

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("deleteAccount error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

