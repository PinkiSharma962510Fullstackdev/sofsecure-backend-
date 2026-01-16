import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import Enquiry from "../models/Enquiry.js";

/* ================== DB CONNECT ================== */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/* ================== GOOGLE SHEET ================== */
async function saveToSheet(data) {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "'Form Responses 1'!A2",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
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
        "Website"
      ]]
    }
  });
}


/* ================== EMAIL ================== */
async function sendMail(data) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, 
    },
  });

  await transporter.sendMail({
    from: `"Website Enquiry" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Website Enquiry",
    html: `
      <h2>New Enquiry Received</h2>
      <p><b>Name:</b> ${data.firstName} ${data.lastName}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Company:</b> ${data.companyName}</p>
      <p><b>Country:</b> ${data.country}</p>
      <p><b>Message:</b><br/>${data.message}</p>
    `,
  });
}

/* ================== API HANDLER ================== */
export default async function handler(req, res) {
  const allowedOrigins = [
    "https://sof-secure-frontend.vercel.app",
    "https://www.sofsecure.com",
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("STEP 1: API HIT");

    const data = req.body || {};
    console.log("STEP 2: BODY RECEIVED", data);

    await connectDB();
    console.log("STEP 3: DB CONNECTED");

    // ✅ DB (critical)
    await Enquiry.create(data);
    console.log("STEP 4: DB SAVED");

    // ✅ Email (critical)
    await sendMail(data);
    console.log("STEP 5: EMAIL SENT");

    // 🟡 Google Sheet (non-critical)
    try {
      await saveToSheet(data);
      console.log("STEP 6: SHEET SAVED");
    } catch (sheetErr) {
      console.error("SHEET ERROR (IGNORED):", sheetErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully",
    });

  } catch (error) {
    console.error("ENQUIRY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
