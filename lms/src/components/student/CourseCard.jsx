import React from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {

  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sm:min-w-auto md:w-auto lg:w-auto mx-0 m-2 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="relative">
        <img
          src={course.courseThumbnail}
          alt=""
          className="w-full h-44 object-cover group-hover:brightness-90 transition"
        />
        {course.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            {course.discount}% OFF
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-gray-800 truncate">
          {course.courseTitle}
        </h3>
        <p className="text-gray-500 mb-3 flex items-center gap-2">
          <span className="font-medium">{course.educator.name}</span>
        </p>
        <div className="flex items-center mb-3">
          <p>{calculateRating(course)}</p>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={i< Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt="" className="w-4 h-4" />
            ))}
          </div>
          <p className="ml-2 text-sm text-gray-400 font-semibold">{course.courseRatings.length}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-green-700 font-bold text-lg">
            {currency}
            {(
              course.coursePrice -
              (course.discount * course.coursePrice) / 100
            ).toFixed(2)}
          </p>
          {course.discount > 0 && (
            <span className="text-gray-400 line-through text-sm">
              {currency}
              {course.coursePrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
