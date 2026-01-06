import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import path from "path";                 // ⬅️ ADD
import { fileURLToPath } from "url";     // ⬅️ ADD

import userRoutes from "./routes/userRoutes.js";
import waterUsageRoutes from "./routes/waterUsageRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import activityOptionRoutes from "./routes/activityOptionRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";

const __filename = fileURLToPath(import.meta.url); // ⬅️ ADD
const __dirname = path.dirname(__filename);       // ⬅️ ADD

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === "development" ? true : process.env.CLIENT_URL,
}));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// ⬅️ SERVE APK
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/logs", waterUsageRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/activity-options", activityOptionRoutes);
app.use("/api/achievements", achievementRoutes);

// ⬅️ ADD THIS
app.get("/dl", (req, res) => {
  res.redirect(
    "https://aquapal-backend.onrender.com/public/AquaPal.apk"
  );
});




// Health / root
app.get("/", (req, res) => res.send("API running..."));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});


export default app;
