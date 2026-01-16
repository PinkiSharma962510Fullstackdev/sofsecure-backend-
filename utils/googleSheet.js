const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

async function saveToSheet(data) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        new Date().toLocaleString(),
        data.title,
        data.companyName,
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.country,
        data.message
      ]]
    }
  });
}
