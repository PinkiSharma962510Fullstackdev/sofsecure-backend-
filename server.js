import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import enquiryRoutes from "./routes/enquiry.routes.js";

dotenv.config();
connectDB();

const app = express();

/* 🔥 MIDDLEWARES (500 FIX) */
app.use(cors());
app.use(express.json()); // 👈 MUST
app.use(express.urlencoded({ extended: true }));

/* ROUTES */
app.use("/api/enquiry", enquiryRoutes);

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("SofSecure Backend Running ✅");
});

/* ERROR HANDLER (CRITICAL) */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR ❌", err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
