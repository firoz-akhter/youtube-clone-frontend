import SideVideoCard from "./SideVideoCard";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SideVideoGrid = ({ incrementLike }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const url = "http://localhost:3001/getAllVideos";
    const token = localStorage.getItem("token");

    if (!token) return console.error("Token not found in localStorage");

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

  return (
    <div style={styles.grid}>
      {data.map((video) => (
        <Link
          onClick={() => incrementView(video._id)}
          key={video._id}
          to={`/video/${video._id}`}
        >
          <SideVideoCard key={video.id} video={video} />
        </Link>
      ))}
    </div>
    //
  );
};

const styles = {
  grid: {
    width: "300px",
    borderRadius: "5px",
    backgroundColor: "#fff",
    maxHeight: "500px", // Adjust as needed
  },
};

export default SideVideoGrid;
