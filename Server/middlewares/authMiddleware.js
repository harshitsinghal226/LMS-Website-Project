import { clerkClient } from "@clerk/express";

//Middleware ( Protect Educator Routes )
// In this we will get the request and response and after 
// we will execute the next function
export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const response = await clerkClient.users.getUser(userId);

        // when user has the role of educator, then can not access the educator routes
        if(response.publicMetadata.role !== "educator"){
            return res.json({success: false, message: "Unauthorized Access"});
        }

        next();

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
