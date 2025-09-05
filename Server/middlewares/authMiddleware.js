import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

//Middleware ( Protect Educator Routes )
// In this we will get the request and response and after
// we will execute the next function
export const protectEducator = async (req, res, next) => {
  try {
    const { userId } = req.auth(); // ✅ use req.auth() instead of req.auth

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Check if user exists in our database and has educator role
    const user = await User.findById(userId);
    
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ✅ If the user doesn't have educator role, block access
    if (!user.roles.includes("educator")) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Access - Educator role required" });
    }

    next(); // ✅ allow access if educator
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};
