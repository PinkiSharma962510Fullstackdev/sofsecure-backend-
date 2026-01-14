import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import enquiryRoutes from "./routes/enquiry.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", enquiryRoutes);

app.listen(PORT, () => {
  console.log(`✅ SofSecure Enquiry Backend Running on ${PORT}`);
});
