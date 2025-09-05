import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  // const [testimonials, setTestimonials] = useState([]);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const isEducator = useMemo(() => userRoles.includes("educator"), [userRoles]);
  const isStudent = useMemo(() => userRoles.includes("student"), [userRoles]);

  //Fetch all courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const fetchUserData = useCallback(async () => {
    if (!user) return;
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.user);
        setUserRoles(data.user.roles || ['student']);
      } else if (data.message === "User not found") {
        setShowRoleSelection(true);
      }
    } catch (error) {
      setShowRoleSelection(true);
    }
  }, [user, getToken, backendUrl]);

  // this of RoleSectionModal
  const createUserInDatabase = useCallback(async (roles = ['student']) => {
    if (!user) return false;
    try {
      const token = await getToken();
      const userData = {
        _id: user.id,
        email: user.primaryEmailAddress?.emailAddress || 'no-email@example.com',
        name: user.fullName || user.username || 'User',
        imageUrl: user.imageUrl || 'https://via.placeholder.com/150',
        roles: Array.isArray(roles) ? roles : [roles]
      };
      const { data } = await axios.post(backendUrl + "/api/user/create", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.user);
        setUserRoles(data.user.roles);
        setShowRoleSelection(false);
        toast.success(`User profile created successfully!`);
        return true;
      } else {
        toast.error(data.message || "Failed to create user");
        return false;
      }
    } catch (error) {
      toast.error("Failed to create user profile");
      return false;
    }
  }, [user, getToken, backendUrl]);

  const updateUserRoles = useCallback(async (action, role) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/update-roles",
        { action, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setUserRoles(data.user.roles);
        setUserData(data.user);
        toast.success(`Role ${action === 'add' ? 'added' : 'removed'} successfully!`);
        if (action === 'remove' && data.user.roles.length === 0) {
          navigate("/");
        } else if (action === 'add' && role === "educator" && !data.user.roles.includes("student")) {
          navigate("/educator");
        }
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error("Failed to update roles");
      return false;
    }
  }, [getToken, backendUrl, navigate]);


  const calculateRating = useCallback((course) => {
    if (!course?.courseRatings?.length) return 0;
    const totalRating = course.courseRatings.reduce((sum, rating) => sum + rating.rating, 0);
    return Math.floor(totalRating / course.courseRatings.length);
  }, []);

  const calculateChapterTime = useCallback((chapter) => {
    if (!chapter?.chapterContent?.length) return "0m";
    const time = chapter.chapterContent.reduce((sum, lecture) => sum + (lecture.lectureDuration || 0), 0);
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  }, []);

  const calculateCourseDuration = useCallback((course) => {
    if (!course?.courseContent?.length) return "0m";
    let time = 0;
    course.courseContent.forEach(chapter => {
      if (chapter.chapterContent?.length) {
        chapter.chapterContent.forEach(lecture => {
          time += lecture.lectureDuration || 0;
        });
      }
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  }, []);

  const calculateNoOfLectures = useCallback((course) => {
    if (!course?.courseContent?.length) return 0;
    let totalLectures = 0;
    course.courseContent.forEach(chapter => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  }, []);

  const fetchUserEnrolledCourses = useCallback(async () => {
    if (!user || !isStudent) return;
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/user/enrolled-courses",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolledCourses(data.success ? data.enrolledCourses.reverse() : []);
    } catch (error) {
      setEnrolledCourses([]);
    }
  }, [user, isStudent, getToken, backendUrl]);

  // Refresh all user data
  const refreshUserData = useCallback(async () => {
    await fetchUserData();
    await fetchUserEnrolledCourses();
  }, [fetchUserData, fetchUserEnrolledCourses]);

  const contextValue = useMemo(() => ({
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    isStudent,
    userRoles,
    setUserRoles,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
    refreshCourses: fetchAllCourses, // Add refreshCourses as an alias for fetchAllCourses
    refreshUserData, // Add refreshUserData function
    updateUserRoles,
    // testimonials,
    // addTestimonial,
    // editTestimonial,
    // fetchTestimonials,
    createUserInDatabase,
    showRoleSelection,
    setShowRoleSelection,
  }), [
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    isStudent,
    userRoles,
    setUserRoles,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
    refreshUserData,
    updateUserRoles,
    // testimonials,
    // addTestimonial,
    // editTestimonial,
    // fetchTestimonials,
    createUserInDatabase,
    showRoleSelection,
    setShowRoleSelection,
  ]);

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  useEffect(() => {
    if (user && isSignedIn) {
      fetchUserData();
    }
  }, [user, isSignedIn, fetchUserData]);

  useEffect(() => {
    if (user && isSignedIn && isStudent) {
      fetchUserEnrolledCourses();
    }
  }, [user, isSignedIn, isStudent, fetchUserEnrolledCourses]);

  return (
    <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>
  );
};
