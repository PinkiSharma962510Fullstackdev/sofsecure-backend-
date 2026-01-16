import nodemailer from "nodemailer";
import { google } from "googleapis";

/* ================= GOOGLE AUTH ================= */
const privateKey = process.env.GOOGLE_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("❌ GOOGLE_PRIVATE_KEY missing in Vercel ENV");
}

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  privateKey.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

/* ================= MAIL ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* ================= API HANDLER ================= */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

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

    /* ===== SAVE TO GOOGLE SHEET ===== */
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Form Responses 1!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toLocaleString(),
            title,
            companyName,
            firstName,
            lastName,
            email,
            phone,
            country,
            message,
            "Website Contact Form",
          ],
        ],
      },
    });

    /* ===== SEND EMAIL ===== */
    await transporter.sendMail({
      from: `"SofSecure Website" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Website Enquiry",
      html: `
        <h3>New Enquiry</h3>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Company:</b> ${companyName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Country:</b> ${country}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({ success: false });
  }
}
