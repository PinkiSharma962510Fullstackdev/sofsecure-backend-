import Enquiry from "../models/Enquiry.js";
import { getSheets } from "../utils/google.js";
import { getTransporter } from "../utils/mail.js";

export const createEnquiry = async (req, res) => {
  try {
    const {
      title,
      companyName,
      firstName,
      lastName,
      email,
      phone,
      country,
      message,
    } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({
        message: "First name, email & message are required",
      });
    }

    /* ================= 1️⃣ MONGODB (MUST NEVER FAIL) ================= */
    const enquiry = await Enquiry.create({
      title,
      companyName,
      firstName,
      lastName,
      email,
      phone,
      country,
      message,
    });

    /* ✅ SEND SUCCESS RESPONSE FIRST */
    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
    });

    /* ================= 2️⃣ GOOGLE SHEET (OPTIONAL) ================= */
    try {
      const sheets = getSheets();

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet1!A:J",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            new Date().toLocaleString("en-IN"),
            title || "",
            companyName || "",
            firstName || "",
            lastName || "",
            email || "",
            phone || "",
            country || "",
            message || "",
            "Website",
          ]],
        },
      });

      console.log("✅ Google Sheet updated");
    } catch (err) {
      console.error("⚠️ Google Sheet failed:", err.message);
    }

    /* ================= 3️⃣ MAIL (OPTIONAL) ================= */
    try {
      const transporter = getTransporter();

      await transporter.sendMail({
        from: `"SofSecure Website" <${process.env.MAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "📩 New Website Enquiry",
        html: `
          <h3>New Enquiry Received</h3>
          <p><b>Name:</b> ${firstName} ${lastName || ""}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone || "-"}</p>
          <p><b>Company:</b> ${companyName || "-"}</p>
          <p><b>Country:</b> ${country || "-"}</p>
          <p><b>Message:</b><br/>${message}</p>
        `,
      });

      console.log("📧 Enquiry email sent");
    } catch (err) {
      console.error("⚠️ Mail failed:", err.message);
    }

  } catch (error) {
    console.error("❌ Enquiry Fatal Error:", error.message);
    // yahan rarely aayega (sirf DB fail par)s
  }
};
