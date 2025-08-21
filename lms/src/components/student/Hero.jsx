import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="md:text-[36px] text-[26px] relative font-bold text-gray-800 max-w-3xl mx-auto">
        Empower your future with the courses designed to{" "}
        <span className="text-blue-600">fit your choice.</span>{" "}
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>

      <p className="text-gray-600 md:block hidden max-w-2xl mx-auto">We bring you the best courses from the best educators around the world. Learn at your own pace, anytime, anywhere.
      </p>
      <p className="text-gray-600 md:hidden max-w-sm mx-auto">
        We bring you the best courses from the best educators around the world.
        Learn at your own pace, anytime, anywhere.
      </p>
      <SearchBar/>
    </div>
  );
};

export default Hero;
