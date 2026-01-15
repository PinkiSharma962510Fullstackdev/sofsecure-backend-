import { google } from "googleapis";

let sheetsInstance = null;

export const getSheets = () => {
  if (sheetsInstance) return sheetsInstance;

  if (
    !process.env.GOOGLE_CLIENT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY
  ) {
    throw new Error("❌ Google Sheet ENV missing");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsInstance = google.sheets({
    version: "v4",
    auth,
  });

  return sheetsInstance;
};
