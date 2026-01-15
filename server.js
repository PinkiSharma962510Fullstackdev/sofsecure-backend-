import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import enquiryRoutes from "./routes/enquiry.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", enquiryRoutes);

// health check
app.get("/", (req, res) => {
  res.send("SofSecure Enquiry Backend Running");
});


export default app;
