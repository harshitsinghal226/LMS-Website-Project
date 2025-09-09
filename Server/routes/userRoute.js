import express from "express";
import { clerkWebhooks } from "../controllers/webhooks.js";
import {
  createUser,
  getUserData,
  updateUserRoles,
  purchaseCourse,
  userEnrolledCourses,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
  verifyPayment,
  requestEducatorRole,
  getEducatorRequests,
  approveEducatorRequest,
  rejectEducatorRequest,
  setAdminRole,
  getAllowedAdminEmails,
  addAllowedAdminEmail,
  removeAllowedAdminEmail,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/clerk-webhook", express.raw({ type: "application/json" }), clerkWebhooks);

userRouter.post("/create", createUser);
userRouter.get("/data", getUserData);
userRouter.post("/update-roles", updateUserRoles);
userRouter.post("/purchase", purchaseCourse);
userRouter.post("/verify-payment", verifyPayment);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.post("/get-course-progress", getUserCourseProgress);
userRouter.post("/add-rating", addUserRating);

// Educator request routes
userRouter.post("/request-educator", requestEducatorRole);
userRouter.get("/educator-requests", getEducatorRequests);
userRouter.post("/approve-educator-request", approveEducatorRequest);
userRouter.post("/reject-educator-request", rejectEducatorRequest);

// Admin setup route (for initial setup only)
userRouter.post("/set-admin", setAdminRole);

// Admin email management routes
userRouter.get("/admin-emails", getAllowedAdminEmails);
userRouter.post("/add-admin-email", addAllowedAdminEmail);
userRouter.post("/remove-admin-email", removeAllowedAdminEmail);

export default userRouter;
