import mongoose from "mongoose";
import AdminEmail from "../models/AdminEmail.js";
import dotenv from "dotenv";

dotenv.config();

const addAdminEmail = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Default admin email
    const email = "harshitsinghal226@gmail.com";
    
    console.log(`Adding email to allowed admin list: ${email}`);

    // Check if email already exists
    const existingAdminEmail = await AdminEmail.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!existingAdminEmail) {
      await AdminEmail.create({
        email: email.toLowerCase().trim(),
        addedBy: "system", // System added
        isActive: true
      });
      console.log(`✅ Email ${email} added to allowed admin emails list.`);
    } else if (!existingAdminEmail.isActive) {
      existingAdminEmail.isActive = true;
      existingAdminEmail.addedBy = "system";
      await existingAdminEmail.save();
      console.log(`✅ Email ${email} reactivated in allowed admin emails list.`);
    } else {
      console.log(`✅ Email ${email} is already in the allowed admin emails list.`);
    }

    console.log("Admin email setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding admin email:", error);
    process.exit(1);
  }
};

addAdminEmail();
