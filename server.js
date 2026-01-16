import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import enquiryRoutes from "./routes/enquiry.routes.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());

// 🔥 CORS FIX (slash hata diya)
app.use(
  cors({
    origin: "https://sof-secure-frontend.vercel.app",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

// routes
app.use("/api/enquiry", enquiryRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
