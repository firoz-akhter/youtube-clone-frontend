import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { CiBellOn, CiSearch } from "react-icons/ci";
import { ImYoutube2 } from "react-icons/im";
import { GoPlus } from "react-icons/go";

const Header = ({ setIsCollapsed, onSearch }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstletter, setFirstletter] = useState("F");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const token = localStorage.getItem("token"); // Check for user info in localStorage
    if (!token) {
      setIsLoggedIn(false);
      setFirstletter("");
    } else {
      setIsLoggedIn(true);
      // setFirstletter(user.charAt(0).toUpperCase());
    }
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value); // Update search term state
    onSearch(e.target.value); // Pass the search term to parent component (Homepage)
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-2 sm:px-4 py-2 bg-white shadow-md">
      {/* Hamburger Menu and Logo */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="text-xl text-gray-600 sm:text-2xl"
        >
          <IoMenu size={30} />
        </button>
        <div className="flex items-center space-x-1">
          <Link to={"/"}>
            {/* <img src={youtubelogo} alt="YouTube Logo" className="h-4 w-[100%]  sm:h-6 sm:w-12 md:h-8" /> */}
            <ImYoutube2 size={40} />
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center flex-grow max-w-xs sm:max-w-md ml-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
          placeholder="Search"
          className="flex-grow px-4 py-1 text-xs sm:text-sm md:text-base rounded-l-full border border-gray-300 text-black focus:outline-none"
        />
        <button className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-r-full">
          <CiSearch size={24} />
        </button>
      </div>

      {/* Profile and Notifications */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="text-lg text-gray-600">
          <Link to={"/userprofile"}>
            {/* <img src={pluslogo} width={18} alt="Plus" className="sm:w-5 w-4" /> */}
            <GoPlus size={30} />
          </Link>
        </button>

        <button className="text-lg text-black">
          <CiBellOn size={30} />
        </button>

        {/* Conditional Link to Profile or Form */}
        <Link to={isLoggedIn ? "/userprofile" : "/register"}>
          {isLoggedIn ? (
            <span className="text-red-600 font-medium border-2 border-red-600 rounded-full flex items-center justify-center w-10 h-10 bg-red-100">
              {firstletter}
            </span>
          ) : (
            <span className="text-blue-800 text-sm sm:text-base">Sign Up</span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Header;
