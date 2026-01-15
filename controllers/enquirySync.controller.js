import { getSheets } from "../utils/google.js";
import { getTransporter } from "../utils/mail.js";

export const syncEnquiry = async (req, res) => {
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

    /* GOOGLE SHEET */
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

    /* MAIL */
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"SofSecure" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Enquiry",
      html: `<p>${firstName} (${email}) sent enquiry</p>`,
    });

    return res.json({ success: true });

  } catch (err) {
    console.error("SYNC ERROR:", err.message);
    return res.status(500).json({ message: err.message });
  }
};
