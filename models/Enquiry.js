import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    title: { type: String },
    companyName: { type: String },

    firstName: { type: String, required: true },
    lastName: { type: String },

    email: { type: String, required: true },
    phone: { type: String },

    country: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
