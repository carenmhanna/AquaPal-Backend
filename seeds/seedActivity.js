import dotenv from "dotenv";
// load the .env located in backend (seed file is in backend/seeds)
dotenv.config({ path: "../.env" });

import mongoose from "mongoose";
import Activity from "../models/activity.js";

const activities = [
  { activityName: "Shower" },
  { activityName: "Wash Hands" },
  { activityName: "Bathroom" },
  { activityName: "House Cleaning" },
  { activityName: "Doing Dishes" },
  { activityName: "Laundry" },
];

async function seedActivities() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Activity.deleteMany(); // Optional: clears old data
    await Activity.insertMany(activities);
    console.log("✅ Activities added successfully!");
  } catch (error) {
    console.error("❌ Error seeding activities:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedActivities();