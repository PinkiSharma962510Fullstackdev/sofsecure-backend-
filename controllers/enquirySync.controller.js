// controllers/enquirySync.controller.js
import { getSheets } from "../utils/google.js";
import { getTransporter } from "../utils/mail.js";

export const syncEnquiry = async (req, res) => {
  const data = req.body;

  /* GOOGLE SHEET (SAFE) */
  try {
    const sheets = getSheets();
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString(),
          data.title || "",
          data.companyName || "",
          data.firstName || "",
          data.lastName || "",
          data.email || "",
          data.phone || "",
          data.country || "",
          data.message || "",
          "Website",
        ]],
      },
    });
    console.log("✅ Google Sheet updated");
  } catch (err) {
    console.error("❌ Google Sheet failed", err.message);
  }

  /* MAIL (SAFE) */
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"SofSecure Website" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Enquiry",
      html: `<p>${data.message}</p>`,
    });
    console.log("✅ Mail sent");
  } catch (err) {
    console.error("❌ Mail failed", err.message);
  }

  /* 🔥 ALWAYS SUCCESS */
  return res.status(200).json({ success: true });
};
