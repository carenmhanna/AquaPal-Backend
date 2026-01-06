import dotenv from "dotenv";
// load the backend .env (seed file is in backend/seeds)
dotenv.config({ path: "../.env" });

import mongoose from "mongoose";
import Activity from "../models/activity.js";
import ActivityOption from "../models/activityOption.js";

const optionsData = [
  {
    activityName: "Shower",
    options: [
      { optionName: "Super Quick!", averageDurationMin: 2, waterQuantityLiters: 20 },
      { optionName: "Quick Shower", averageDurationMin: 5, waterQuantityLiters: 50 },
      { optionName: "Normal Shower", averageDurationMin: 10, waterQuantityLiters: 100 },
      { optionName: "Long Shower", averageDurationMin: 15, waterQuantityLiters: 150 },
    ],
  },
  {
    activityName: "Wash Hands",
    options: [
      { optionName: "Quick Rinse", averageDurationMin: 0.3, waterQuantityLiters: 2 },
      { optionName: "Good Wash", averageDurationMin: 0.5, waterQuantityLiters: 4 },
      { optionName: "Extra Clean", averageDurationMin: 0.8, waterQuantityLiters: 6 },
      { optionName: "Super Soap", averageDurationMin: 1, waterQuantityLiters: 10 },
    ],
  },
  {
    activityName: "Bathroom",
    options: [
      { optionName: "Small Button", averageDurationMin: 0.1, waterQuantityLiters: 6 },
      { optionName: "Big Button", averageDurationMin: 0.1, waterQuantityLiters: 9 },
    ],
  },
  {
    activityName: "House Cleaning",
    options: [
      { optionName: "Quick Clean", averageDurationMin: 10, waterQuantityLiters: 5 },
      { optionName: "Good Clean", averageDurationMin: 20, waterQuantityLiters: 10 },
      { optionName: "Extra Clean", averageDurationMin: 30, waterQuantityLiters: 15 },
      { optionName: "Super Clean", averageDurationMin: 45, waterQuantityLiters: 25 },
    ],
  },
  {
    activityName: "Doing Dishes",
    options: [
      { optionName: "One Dish", averageDurationMin: 0.5, waterQuantityLiters: 0.5 },
      { optionName: "Two Dishes", averageDurationMin: 1, waterQuantityLiters: 1 },
      { optionName: "Three Dishes", averageDurationMin: 1.5, waterQuantityLiters: 1.5 },
      { optionName: "Lots of Dishes!", averageDurationMin: 2, waterQuantityLiters: 2 },
    ],
  },
  {
    activityName: "Laundry",
    options: [
      { optionName: "Few Clothes", averageDurationMin: 30, waterQuantityLiters: 40 },
      { optionName: "Some Clothes", averageDurationMin: 45, waterQuantityLiters: 60 },
      { optionName: "Lots of Clothes", averageDurationMin: 60, waterQuantityLiters: 80 },
      { optionName: "All the Clothes!", averageDurationMin: 90, waterQuantityLiters: 100 },
    ],
  },
];

async function seedActivityOptions() {
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

    await ActivityOption.deleteMany();

    for (const { activityName, options } of optionsData) {
      const activity = await Activity.findOne({ activityName });
      if (!activity) {
        console.warn(`⚠️ Activity not found: ${activityName}`);
        continue;
      }

      const activityOptions = options.map(opt => ({
        ...opt,
        activityId: activity._id,
      }));

      await ActivityOption.insertMany(activityOptions);
      console.log(`✅ Options added for ${activityName}`);
    }
  } catch (error) {
    console.error("❌ Error seeding activity options:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedActivityOptions();
