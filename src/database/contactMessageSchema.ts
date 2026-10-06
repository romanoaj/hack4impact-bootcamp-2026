import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 25 },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 2_000 },
  },
  { timestamps: true },
);

export type ContactMessageType = InferSchemaType<typeof ContactMessageSchema>;

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
