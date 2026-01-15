import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import enquiryRoutes from "./routes/enquiry.routes.js";

dotenv.config();
connectDB();

const app = express();   // ✅ VERY IMPORTANT (missing before)

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROUTES */
app.use("/api/enquiry", enquiryRoutes);

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("SofSecure Backend Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
