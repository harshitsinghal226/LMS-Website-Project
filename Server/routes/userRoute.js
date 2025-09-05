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
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/clerk-webhook", express.raw({ type: "application/json" }), clerkWebhooks);

userRouter.post("/create", createUser);
userRouter.get("/data", getUserData);
userRouter.post("/update-roles", updateUserRoles);
userRouter.post("/purchase", purchaseCourse);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.get("/get-course-progress", getUserCourseProgress);
userRouter.post("/add-rating", addUserRating);

export default userRouter;
