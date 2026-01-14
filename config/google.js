// import { google } from "googleapis";

// const auth = new google.auth.GoogleAuth({
//   credentials: {
//     client_email: process.env.GOOGLE_CLIENT_EMAIL,
//     private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//   },
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// export const sheets = google.sheets({
//   version: "v4",
//   auth,
// });

import { google } from "googleapis";

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"]
);

export const sheets = google.sheets({
  version: "v4",
  auth,
});
