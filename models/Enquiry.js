import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    title: String,
    companyName: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    country: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry ||
  mongoose.model("Enquiry", EnquirySchema);
