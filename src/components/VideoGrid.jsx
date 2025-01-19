import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";

const VideoGrid = ({ searchQuery, selectedFilter }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const url = "http://localhost:3001/getAllVideos";
    const token = localStorage.getItem("token");

    // if (!token) return console.error("Token not found in localStorage");

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { access_token: `${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error("Failed to fetch videos:", response.status);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  async function incrementView(videoId) {
    console.log("trying to increment the view...");
    try {
      const response = await fetch(`http://localhost:3001/addview/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("response", response);

      if (response.ok) {
        console.log("inside if");
        const data = await response.json();
        console.log(data.message);
        console.log(`Updated views: ${data.video.views}`);
      } else {
        console.error("Failed to increment view:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while incrementing view:", error);
    }
  }

  // Filter videos by title and selected filter
  const filteredVideos = data.filter(
    (video) =>
      (selectedFilter === "All" ||
        video.title.toLowerCase().includes(selectedFilter.toLowerCase())) &&
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("filteredVideos", filteredVideos);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {filteredVideos.map((video) => (
        <Link
          onClick={() => incrementView(video._id)}
          key={video._id}
          to={`/video/${video._id}`}
        >
          <VideoCard video={video} />
        </Link>
      ))}
    </div>
  );
};

export default VideoGrid;
