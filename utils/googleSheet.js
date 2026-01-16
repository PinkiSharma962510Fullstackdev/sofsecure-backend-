import { google } from "googleapis";

export async function addToSheet(data) {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  await auth.authorize();

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "'Form Responses 1'!A1",
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
        data.message || ""
      ]]
    }
  });
}
