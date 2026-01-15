import express from "express";
import { createEnquiry } from "../controllers/enquiry.controller.js";
import { syncEnquiry } from "../controllers/enquirySync.controller.js";

const router = express.Router();

router.post("/", createEnquiry);        // MongoDB
router.post("/sync", syncEnquiry);      // Google Sheet + Mail

export default router;
