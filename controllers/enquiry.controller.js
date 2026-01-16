import axios from "axios";
import Enquiry from "../models/Enquiry.js";

export const createEnquiry = async (req, res) => {
  try {
    // 1️⃣ DB SAVE (Mongo)
    // await Enquiry.create(req.body);

    // 2️⃣ Google Sheet + Mail
    await axios.post(
      process.env.GOOGLE_SCRIPT_URL,
      req.body,
      { headers: { "Content-Type": "application/json" } }
    );

    return res.json({ success: true });

  } catch (err) {
    console.error("ENQUIRY ERROR 👉", err);
    return res.status(500).json({ success: false });
  }
};
