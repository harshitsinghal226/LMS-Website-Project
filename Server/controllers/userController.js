import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import EducatorRequest from "../models/EducatorRequest.js";
import AdminEmail from "../models/AdminEmail.js";

//Get User Data
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { _id, email, name, imageUrl, roles } = req.body;
    const existingUser = await User.findById(_id);
    
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      _id,
      email,
      name,
      imageUrl,
      roles: Array.isArray(roles) ? roles : [roles]
    });

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateUserRoles = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { action, role } = req.body;

    if (!action || !role) {
      return res.json({ success: false, message: "Action and role are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (action === 'add' && !user.roles.includes(role)) {
      user.roles.push(role);
    } else if (action === 'remove' && user.roles.includes(role)) {
      user.roles = user.roles.filter(r => r !== role);
    }

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { userId } = req.auth();
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "Data not Found" });
    }

    // Check if user is already enrolled in this course
    if (userData.enrolledCourses.includes(courseId)) {
      return res.json({ success: false, message: "You are already enrolled in this course" });
    }

    // Check if there's already a pending or completed purchase for this user and course
    const existingPurchase = await Purchase.findOne({
      userId,
      courseId: courseData._id,
      status: { $in: ['pending', 'completed'] }
    });

    if (existingPurchase) {
      if (existingPurchase.status === 'completed') {
        return res.json({ success: false, message: "You are already enrolled in this course" });
      } else {
        return res.json({ success: false, message: "You already have a pending purchase for this course" });
      }
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    //Stripe Gateway Initialization
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // Creating line items to for stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments?purchaseId=${newPurchase._id.toString()}`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// User Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).populate("enrolledCourses");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId, lectureId } = req.body;

    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture already completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Course Progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId } = req.body;

    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (!progressData) {
      return res.json({ success: false, message: "No progress found" });
    }

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add User Ratings to Course
export const addUserRating = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({ success: false, message: "User not found" });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();
    res.json({ success: true, message: "Rating added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify Payment and Complete Enrollment
export const verifyPayment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { purchaseId } = req.body;

    if (!purchaseId) {
      return res.json({ success: false, message: "Purchase ID required" });
    }

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.json({ success: false, message: "Purchase not found" });
    }

    if (purchase.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    if (purchase.status === 'completed') {
      return res.json({ success: true, message: "Already enrolled" });
    }

    // Verify with Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Find the checkout session for this purchase
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    const session = sessions.data.find(s => s.metadata?.purchaseId === purchaseId);
    
    if (!session) {
      return res.json({ success: false, message: "Payment session not found" });
    }

    if (session.payment_status !== 'paid') {
      return res.json({ success: false, message: "Payment not completed" });
    }

    // Get user and course data
    const user = await User.findById(purchase.userId);
    const course = await Course.findById(purchase.courseId.toString());

    if (!user || !course) {
      return res.json({ success: false, message: "User or course not found" });
    }

    // Update enrollment
    await Course.updateOne(
      { _id: course._id },
      { $addToSet: { enrolledStudents: user._id } }
    );

    await User.updateOne(
      { _id: user._id },
      { $addToSet: { enrolledCourses: course._id } }
    );

    // Update purchase status
    purchase.status = 'completed';
    if (session.payment_intent) {
      purchase.paymentIntentId = typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent.id;
    }
    await purchase.save();

    res.json({ success: true, message: "Payment verified and enrollment completed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Request to become educator
export const requestEducatorRole = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if user already has educator role
    if (user.roles.includes('educator')) {
      return res.json({ success: false, message: "User is already an educator" });
    }

    // Check if there's already a pending request
    const existingRequest = await EducatorRequest.findOne({ 
      userId, 
      status: 'pending' 
    });

    if (existingRequest) {
      return res.json({ success: false, message: "You already have a pending educator request" });
    }

    // Create new educator request
    const educatorRequest = await EducatorRequest.create({
      userId,
      email: user.email,
      name: user.name,
      status: 'pending'
    });

    res.json({ success: true, message: "Educator request submitted successfully", request: educatorRequest });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all educator requests (Admin only)
export const getEducatorRequests = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    
    if (!user || !user.roles.includes('admin')) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    // Check if user's email is allowed for admin access
    const isEmailAllowed = await isEmailAllowedForAdmin(user.email);
    if (!isEmailAllowed) {
      return res.json({ success: false, message: "Your email is not authorized for admin access" });
    }

    const requests = await EducatorRequest.find()
      .populate('userId', 'name email imageUrl')
      .sort({ requestedAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Approve educator request (Admin only)
export const approveEducatorRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { requestId } = req.body;
    
    const admin = await User.findById(userId);
    if (!admin || !admin.roles.includes('admin')) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    // Check if admin's email is allowed for admin access
    const isEmailAllowed = await isEmailAllowedForAdmin(admin.email);
    if (!isEmailAllowed) {
      return res.json({ success: false, message: "Your email is not authorized for admin access" });
    }

    const request = await EducatorRequest.findById(requestId);
    if (!request) {
      return res.json({ success: false, message: "Request not found" });
    }

    if (request.status !== 'pending') {
      return res.json({ success: false, message: "Request has already been processed" });
    }

    // Update user roles to include educator
    await User.findByIdAndUpdate(request.userId, {
      $addToSet: { roles: 'educator' }
    });

    // Update request status
    request.status = 'approved';
    request.reviewedAt = new Date();
    request.reviewedBy = userId;
    await request.save();

    res.json({ success: true, message: "Educator request approved successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Reject educator request (Admin only)
export const rejectEducatorRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { requestId, reason } = req.body;
    
    const admin = await User.findById(userId);
    if (!admin || !admin.roles.includes('admin')) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    // Check if admin's email is allowed for admin access
    const isEmailAllowed = await isEmailAllowedForAdmin(admin.email);
    if (!isEmailAllowed) {
      return res.json({ success: false, message: "Your email is not authorized for admin access" });
    }

    const request = await EducatorRequest.findById(requestId);
    if (!request) {
      return res.json({ success: false, message: "Request not found" });
    }

    if (request.status !== 'pending') {
      return res.json({ success: false, message: "Request has already been processed" });
    }

    // Update request status
    request.status = 'rejected';
    request.reviewedAt = new Date();
    request.reviewedBy = userId;
    request.reason = reason || 'No reason provided';
    await request.save();

    res.json({ success: true, message: "Educator request rejected successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Set admin role (for initial setup - should be removed in production)
export const setAdminRole = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Add admin role if not already present
    if (!user.roles.includes('admin')) {
      user.roles.push('admin');
      await user.save();
    }

    res.json({ success: true, message: "Admin role added successfully", user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Check if email is allowed for admin access
export const isEmailAllowedForAdmin = async (email) => {
  const adminEmail = await AdminEmail.findOne({ 
    email: email.toLowerCase().trim(), 
    isActive: true 
  });
  return !!adminEmail;
};

// Get all allowed admin emails
export const getAllowedAdminEmails = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    
    if (!user || !user.roles.includes('admin')) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    const adminEmails = await AdminEmail.find({ isActive: true })
      .populate('addedBy', 'name email')
      .sort({ addedAt: -1 });

    res.json({ success: true, adminEmails });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add email to allowed admin list
export const addAllowedAdminEmail = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { email } = req.body;
    
    const user = await User.findById(userId);
    if (!user || !user.roles.includes('admin')) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    // Check if email already exists
    const existingEmail = await AdminEmail.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingEmail) {
      if (existingEmail.isActive) {
        return res.json({ success: false, message: "Email is already in the allowed list" });
      } else {
        // Reactivate the email
        existingEmail.isActive = true;
        existingEmail.addedBy = userId;
        existingEmail.addedAt = new Date();
        await existingEmail.save();
        return res.json({ success: true, message: "Email reactivated successfully", adminEmail: existingEmail });
      }
    }

    // Create new admin email entry
    const adminEmail = await AdminEmail.create({
      email: email.toLowerCase().trim(),
      addedBy: userId
    });

    res.json({ success: true, message: "Email added to allowed list successfully", adminEmail });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Remove email from allowed admin list
export const removeAllowedAdminEmail = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { emailId } = req.body;
    
    const user = await User.findById(userId);
    if (!user || !user.roles.includes('admin')) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    if (!emailId) {
      return res.json({ success: false, message: "Email ID is required" });
    }

    const adminEmail = await AdminEmail.findById(emailId);
    if (!adminEmail) {
      return res.json({ success: false, message: "Email not found" });
    }

    // Soft delete by setting isActive to false
    adminEmail.isActive = false;
    await adminEmail.save();

    res.json({ success: true, message: "Email removed from allowed list successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
