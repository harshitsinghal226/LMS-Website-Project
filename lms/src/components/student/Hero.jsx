import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-24 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-teal-50/80 via-emerald-50/60 to-transparent">
      <h1 className="md:text-[40px] text-[28px] leading-tight relative font-extrabold text-slate-900 max-w-3xl mx-auto">
        Empower your future with the courses designed to{" "}
        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">fit your choice.</span>{" "}
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0 opacity-80"
        />
      </h1>

      <p className="text-slate-600 md:block hidden max-w-2xl mx-auto">We bring you the best courses from the best educators around the world. Learn at your own pace, anytime, anywhere.
      </p>
      <p className="text-slate-600 md:hidden max-w-sm mx-auto">
        We bring you the best courses from the best educators around the world.
        Learn at your own pace, anytime, anywhere.
      </p>
      <SearchBar/>
    </div>
  );
};

export default Hero;
