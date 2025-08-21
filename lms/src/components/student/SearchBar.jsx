import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
    setInput("");
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-3xl w-full h-15 bg-white rounded-full flex items-center justify-between shadow-md px-3 md:px-5 mx-auto"
    >
      <img
        src={assets.search_icon}
        alt="search_icon"
        className="md:w-auto w-10 px-3"
      />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search for courses"
        className="w-full h-full outline-none text-gray-500/80"
      />
      <button
        type="submit"
        className="bg-blue-600 rounded-2xl text-white md:px-8 px-7 md:py-2 py-1 mx-2"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
