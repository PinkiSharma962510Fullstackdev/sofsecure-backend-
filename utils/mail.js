import nodemailer from "nodemailer";

async function sendMail(data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SofSecure" <${process.env.MAIL_USER}>`,
    to: "info@sofsecure.com",
    subject: "New Enquiry Received",
    html: `
      <h3>New Enquiry</h3>
      <p><b>Name:</b> ${data.firstName} ${data.lastName}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Message:</b> ${data.message}</p>
    `,
  });
}

export { sendMail };  // ✅ named export
