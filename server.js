import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import enquiryRoutes from "./routes/enquiry.routes.js";
import enquirySyncRoutes from "./routes/enquirySync.routes.js"; // ✅ ADD THIS

dotenv.config();
connectDB();

const app = express();

/* 🔥 MIDDLEWARES */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROUTES */
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/enquiry-sync", enquirySyncRoutes); // ✅ ADD THIS

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("SofSecure Backend Running ✅");
});

/* ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR ❌", err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
