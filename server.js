import express from "express";
import cors from "cors";

const app = express();

// Allow all origins (for testing)
app.use(cors());

// OR allow only your frontend domain (recommended for production)
app.use(cors({
  origin: "https://sof-secure-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Parse JSON
app.use(express.json());

// Your routes
import enquiryRoutes from "./routes/enquiry.routes.js";
app.use("/api/enquiry", enquiryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
