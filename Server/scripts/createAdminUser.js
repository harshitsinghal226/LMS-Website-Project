import mongoose from "mongoose";
import User from "../models/User.js";
import AdminEmail from "../models/AdminEmail.js";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get email and name from command line arguments
    const email = process.argv[2];
    const name = process.argv[3] || "Admin User";
    
    if (!email) {
      console.log("Usage: node createAdminUser.js <email> [name]");
      console.log("Example: node createAdminUser.js admin@example.com \"John Doe\"");
      process.exit(1);
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      console.log(`User with email ${email} already exists.`);
    } else {
      // Create new user
      const userId = new mongoose.Types.ObjectId().toString();
      user = await User.create({
        _id: userId,
        email: email,
        name: name,
        imageUrl: 'https://via.placeholder.com/150',
        roles: ['admin']
      });
      console.log(`User created successfully: ${email}`);
    }

    // Add admin role if not already present
    if (!user.roles.includes('admin')) {
      user.roles.push('admin');
      await user.save();
      console.log(`Admin role added successfully to user: ${email}`);
    } else {
      console.log(`User ${email} already has admin role.`);
    }

    // Add email to allowed admin emails list
    const existingAdminEmail = await AdminEmail.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!existingAdminEmail) {
      await AdminEmail.create({
        email: email.toLowerCase().trim(),
        addedBy: user._id
      });
      console.log(`Email ${email} added to allowed admin emails list.`);
    } else if (!existingAdminEmail.isActive) {
      existingAdminEmail.isActive = true;
      existingAdminEmail.addedBy = user._id;
      await existingAdminEmail.save();
      console.log(`Email ${email} reactivated in allowed admin emails list.`);
    } else {
      console.log(`Email ${email} is already in the allowed admin emails list.`);
    }

    console.log("Admin user setup completed successfully!");
    console.log(`User can now login with email: ${email}`);
    console.log("Note: The user will need to complete the authentication process through your auth provider (Clerk)");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
