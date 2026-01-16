import { sendMail } from "../utils/mail.js";
import { addToSheet } from "../utils/googleSheet.js";

export const createEnquiry = async (req, res) => {
  try {
    const data = req.body;

    // 📩 Send email
    await sendMail(data);

    // 📊 Save to Google Sheet
    await addToSheet(data);

    return res.json({ success: true, message: "Enquiry submitted successfully!" });

  } catch (err) {
    console.error("ENQUIRY ERROR 👉", err);
    return res.status(500).json({ success: false, message: "Submission failed!" });
  }
};
