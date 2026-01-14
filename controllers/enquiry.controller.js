import { sheets } from "../config/google.js";
import nodemailer from "nodemailer";

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

    if (!firstName || !email || !phone) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    /* 🔹 SAVE TO GOOGLE SHEET */
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:J",
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
          "Contact Modal"
        ]],
      },
    });

    /* 🔹 SEND EMAIL */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

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

    res.json({ message: "Enquiry submitted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
