import express from "express";
import { syncEnquiry } from "../controllers/enquirySync.controller.js";

const router = express.Router();
router.post("/", syncEnquiry);
export default router;
