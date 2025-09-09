import mongoose from "mongoose";

const adminEmailSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    addedBy: { 
      type: String, 
      required: true, 
      ref: "User" 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    addedAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

export default mongoose.model("AdminEmail", adminEmailSchema);
