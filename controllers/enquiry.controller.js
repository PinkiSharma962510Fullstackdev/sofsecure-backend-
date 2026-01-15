import Enquiry from "../models/Enquiry.js";
import { getSheets } from "../utils/google.js";
import { getTransporter } from "../utils/mail.js";

export const createEnquiry = async (req, res) => {
  try {
    console.log("📩 Incoming Enquiry:", req.body);

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

    /* 1️⃣ SAVE TO MONGODB */
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

    /* 2️⃣ SAVE TO GOOGLE SHEET */
    const sheets = getSheets();
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString(),
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

    /* 3️⃣ SEND EMAIL */
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"SofSecure Website" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Website Enquiry",
      html: `
        <h3>New Enquiry Received</h3>
        <p><b>Name:</b> ${firstName} ${lastName || ""}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Company:</b> ${companyName}</p>
        <p><b>Country:</b> ${country}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    console.log("📧 Enquiry email sent");

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
    });

  } catch (error) {
    console.error("❌ Enquiry Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
