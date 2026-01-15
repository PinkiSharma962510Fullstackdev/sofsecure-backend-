import Enquiry from "../models/Enquiry.js";

export const createEnquiry = async (req, res) => {
  try {
    console.log("📩 Incoming Enquiry:", req.body);

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

    /* 🔥 VALIDATION */
    if (!firstName || !email || !message) {
      return res.status(400).json({
        message: "First name, email & message are required",
      });
    }

    const enquiry = await Enquiry.create({
      title,
      companyName,
      firstName,
      lastName,
      email,
      phone,
      country,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error("❌ Enquiry Error:", error);
    res.status(500).json({ message: error.message });
  }
};
