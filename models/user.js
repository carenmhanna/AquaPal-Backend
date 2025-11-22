import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  SchoolName:  { type: String },
  gender:    { type: String, enum: ["Male", "Female"], required: true },
  country:   { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  waterBuddy:  { type: String, enum: ["coral", "luna", "splash"], default: "splash" },
  waterSaved:  { type: Number, default: 0 },
  password:    { type: String, required: true },
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }],
  ageGroup: { type: String, enum: ["5-8", "9-12", "13-18"], default: "9-12" }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

export default User;