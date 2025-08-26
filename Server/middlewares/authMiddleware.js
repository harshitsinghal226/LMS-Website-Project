import { clerkClient } from "@clerk/express";

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

    const user = await clerkClient.users.getUser(userId);

    // ✅ If the role is not educator, block access
    if (user.publicMetadata.role !== "educator") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Access" });
    }

    next(); // ✅ allow access if educator
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};
