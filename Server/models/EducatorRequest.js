import mongoose from "mongoose";

const educatorRequestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    email: { type: String, required: true },
    name: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    requestedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: String, ref: "User" },
    reason: { type: String }, // For rejection reason
  },
  { timestamps: true }
);

export default mongoose.model("EducatorRequest", educatorRequestSchema);
