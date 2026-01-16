import express from "express";
import dotenv from "dotenv";
// import mongoose from "mongoose";
import cors from "cors";              // 👈 YE LINE ADD
import enquiryRoutes from "./routes/enquiry.routes.js";


dotenv.config();

const app = express();

// middleware
app.use(express.json());

app.use(
  cors({
    origin: "https://sof-secure-frontend.vercel.app/",
    methods: ["GET", "POST"],
  })
);

// routes
app.use("/api/enquiry", enquiryRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// DB connect
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB connected ✅"))
//   .catch((err) => console.error("MongoDB error ❌", err));

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
