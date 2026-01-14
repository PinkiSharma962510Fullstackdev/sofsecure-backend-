import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import enquiryRoutes from "./routes/enquiry.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", enquiryRoutes);

app.listen(5000, () => {
  console.log("✅ SofSecure Enquiry Backend Running on 5000");
});
