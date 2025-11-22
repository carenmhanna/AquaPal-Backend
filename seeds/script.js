import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/user.js";

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear only users collection and insert the requested users
    await User.deleteMany({});

    const users = await User.create([
      {
        firstName: "Chris",
        lastName: "Maz",
        SchoolName: "",
        ageGroup: "25-34",
        gender: "Male",
        country: "Lebanon",
        email: "chris.maz@example.com",
        phoneNumber: "+96170000001",
        waterBuddy: "",
        password: "pass123"
      },
      {
        firstName: "Caren",
        lastName: "Mhanna",
        SchoolName: "",
        ageGroup: "18-24",
        gender: "Female",
        country: "Lebanon",
        email: "caren.mhanna@example.com",
        phoneNumber: "+96170000002",
        waterBuddy: "",
        password: "password1"
      },
      {
        firstName: "User",
        lastName: "Test",
        SchoolName: "",
        ageGroup: "18-24",
        gender: "Male",
        country: "Lebanon",
        email: "user.test@example.com",
        phoneNumber: "+96170000003",
        waterBuddy: "",
        password: "test123"
      }
    ]);

    console.log(`Created ${users.length} users`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedUsers();