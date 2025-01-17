import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoGrid from "../components/VideoGrid";
import FilterBar from "../components/FilterBar";
import SidebarCollapse from "./SidebarClopse";

function Homepage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // console.log("isLoggedIn", isLoggedIn);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All"); // New state for selected filter


  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter); // Update the selected filter
    console.log(selectedFilter);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header setIsCollapsed={setIsCollapsed} onSearch={handleSearchChange} />

      <div className="flex flex-1 overflow-hidden">
        <div
          className="sidebar-container"
          style={{
            width: isCollapsed ? "60px" : "220px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            height: "auto",
            overflowY: isCollapsed ? "hidden" : "auto",
            scrollbarWidth: "thin",
            transition: "width 0.3s ease",
          }}
        >
          {isCollapsed ? <SidebarCollapse /> : <Sidebar />}
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <FilterBar handleFilterChange={handleFilterChange} />

          <div className="flex-1 overflow-y-auto p-4">
            <VideoGrid searchQuery={searchQuery} selectedFilter={selectedFilter} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;