import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {

  const {allCourses} = useContext(AppContext)

  return (
    <div className="py-16 md:px-40 px-8">
      <h2 className="text-3xl font-bold text-slate-900">Learn from the best</h2>
      <p className="text-sm md:text-base text-slate-600 mt-3 mb-6 max-w-2xl">
        Explore our website's course section for a curated selection of top-rated courses in fields like digital marketing, data science, and web development, all designed to equip you with the skills for success.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-6">
        {allCourses.slice(0,4).map((course, index)=> <CourseCard key={index} course={course}/>)}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          to={'/course-list'}
          onClick={() => scrollTo(0,0)}
          className="text-emerald-700 font-semibold border border-emerald-300 px-8 py-3 rounded-full shadow hover:bg-emerald-600 hover:text-white transition"
        >
          Show all courses
        </Link>
      </div>
    </div>
  )
}

export default CoursesSection