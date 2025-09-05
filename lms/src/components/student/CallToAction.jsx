import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const { isEducator, isStudent } = useContext(AppContext);
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isSignedIn) {
      if (isEducator) {
        navigate("/educator/add-course");
      }else {
        navigate("/course-list");
      }
    } else {
      // For non-logged in users, open Clerk sign-in modal
      openSignIn();
    }
  };

  const handleLearnMore = () => {
    navigate("/course-list");
  };

  return (
    <div className="py-20 px-4 md:px-8 bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Learn anything,{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            anytime, anywhere
          </span>
        </h1>

        {/* Dynamic Description based on user status */}
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          {isSignedIn ? (
            isEducator ? (
              "Ready to share your knowledge? Create engaging courses and inspire the next generation of learners. Your expertise can change lives."
            ) : isStudent ? (
              "Continue your learning journey with our curated collection of courses. From beginner to advanced, we have something for every skill level."
            ) : (
              "Explore our diverse course catalog and discover new skills that will advance your career and personal growth."
            )
          ) : (
            "Join thousands of learners worldwide and unlock your potential with our comprehensive online courses. Start your journey today and transform your future."
          )}
        </p>

        {/* Stats Section for logged-in users */}
        {isSignedIn && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {isEducator ? "∞" : "100+"}
              </div>
              <div className="text-gray-600 font-medium">
                {isEducator ? "Students Reached" : "Courses Available"}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {isEducator ? "24/7" : "24/7"}
              </div>
              <div className="text-gray-600 font-medium">
                {isEducator ? "Teaching Support" : "Learning Access"}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {isEducator ? "Global" : "Global"}
              </div>
              <div className="text-gray-600 font-medium">
                {isEducator ? "Student Network" : "Community"}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          <button
            onClick={handleGetStarted}
            className="px-8 md:px-12 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg min-w-[200px]"
          >
            {isSignedIn
              ? isEducator
                ? "Create Course"
                : "Browse Courses"
              : "Get Started"}
          </button>
          
          <button
            onClick={handleLearnMore}
            className="px-8 md:px-12 py-4 border-2 border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-200 font-semibold text-lg min-w-[200px] group"
          >
            <span className="flex items-center justify-center gap-2">
              Learn More
              <svg 
                className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        {/* Additional Features for logged-in users */}
        {isSignedIn && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {isEducator ? "Course Creation" : "Expert Instructors"}
              </h3>
              <p className="text-sm text-gray-600">
                {isEducator ? "Build engaging courses with our powerful tools" : "Learn from industry professionals"}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {isEducator ? "Student Analytics" : "Progress Tracking"}
              </h3>
              <p className="text-sm text-gray-600">
                {isEducator ? "Monitor student engagement and progress" : "Track your learning journey"}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {isEducator ? "Community Support" : "Peer Learning"}
              </h3>
              <p className="text-sm text-gray-600">
                {isEducator ? "Connect with fellow educators" : "Learn alongside other students"}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {isEducator ? "Flexible Teaching" : "Flexible Learning"}
              </h3>
              <p className="text-sm text-gray-600">
                {isEducator ? "Teach at your own pace" : "Learn at your own pace"}
              </p>
            </div>
          </div>
        )}

        {/* Trust indicators for non-logged in users */}
        {!isSignedIn && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Trusted by learners worldwide</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-2xl">🎓</div>
              <div className="text-2xl">💼</div>
              <div className="text-2xl">🚀</div>
              <div className="text-2xl">🌟</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallToAction;
