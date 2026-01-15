import nodemailer from "nodemailer";

let transporter;

export const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error(" Mail ENV missing");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return transporter;
};
