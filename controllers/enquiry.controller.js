import { getSheets } from "../config/google.js";
import { getTransporter } from "../config/mail.js";

export const createEnquiry = async (req, res) => {
  try {
    console.log(
      "CLIENT EMAIL:", process.env.GOOGLE_CLIENT_EMAIL,
      "KEY STARTS:", process.env.GOOGLE_PRIVATE_KEY?.slice(0, 30)
    );

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

    if (!firstName || !email || !phone) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    /* 🔹 GOOGLE SHEET */
    const sheets = getSheets();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:J", // ⚠️ Sheet name EXACT hona chahiye
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString("en-IN"),
          title,
          companyName,
          firstName,
          lastName,
          email,
          phone,
          country,
          message,
          "Contact Modal",
        ]],
      },
    });

    /* 🔹 EMAIL */
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"SofSecure Enquiry" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New SofSecure Enquiry",
      html: `
        <h2>New Enquiry Received</h2>
        <p><b>Name:</b> ${title} ${firstName} ${lastName}</p>
        <p><b>Company:</b> ${companyName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Country:</b> ${country}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    res.status(200).json({ message: "Enquiry submitted successfully" });

  } catch (err) {
    console.error("❌ Enquiry Error:", err.message);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
