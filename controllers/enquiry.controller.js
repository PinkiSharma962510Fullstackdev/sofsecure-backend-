import Enquiry from "../models/Enquiry.js";

export const createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Saved to DB",
      enquiryId: enquiry._id,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
