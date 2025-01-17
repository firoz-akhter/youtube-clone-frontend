import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiLike, BiDislike } from "react-icons/bi";
import { PiShareFatLight } from "react-icons/pi";
import { RxDownload } from "react-icons/rx";
import SideVideoGrid from "./SideVideoGrid";
import Header from "../components/Header";
import Sidebar from "./Sidebar";
import axios from "axios"; // Import axios

function VideoPlayer() {
  const { id } = useParams(); // Get the video ID from the URL
  const [video, setVideo] = useState(null);
  const [videoId, setVideoId] = useState("H1tmzvmxJnw");
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [comments, setComments] = useState([]); // Initialize comments state
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  let embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";

  useEffect(() => {
    fetchVideo();
    let youtubeVideoId = 
    let videoSrc = `https://www.youtube.com/embed/${videoId}`;
  }, [id]); // Refetch video and comments whenever `id` changes

  const fetchVideo = async () => {
    const url = `http://localhost:3001/getVideo/${id}`; // API endpoint to get videos

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(url, {
        headers: { access_token: `${token}` },
      });

      

      if (response.status === 200) {
        setVideo(response.data.video);
        setComments(response.data.video.comments);
      } else {
        console.error("Failed to fetch video details");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    } finally {
      setLoading(false); // Stop loading state after fetching
    }
  };

  // const fetchComments = useCallback(async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:5100/api/getComments/${id}`);
  //     if (response.status === 200) {
  //       setComments(response.data); // Set the comments to state
  //     } else {
  //       console.error("Failed to fetch comments:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching comments:", error);
  //   }
  // }, [id]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const addComment = async () => {
    if (!newComment.trim()) return alert("Comment cannot be empty");

    let user = JSON.parse(localStorage.getItem("userData"));
    let token = localStorage.getItem("token");
    const commentData = {
      text: newComment,
      userId: user._id, // Replace with actual user ID
      videoId: video._id,
    };

    try {
      const response = await axios.post(
        `http://localhost:3001/addComment/${video._id}`,
        commentData,
        {
          headers: {
            access_token: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        // const newCommentObj = response.data; // Assuming the backend returns the created comment

        // Add the new comment to the state immediately (without reloading the page)
        let comments = await axios.post(
          `http://localhost:3001/getComments/${video._id}`,
          commentData,
          {
            headers: {
              access_token: `${token}`,
            },
          }
        );
        setComments(comments);
      } else {
        console.error("Failed to post comment:", response.status);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const deleteComment = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/deleteComment/${id}`,
        {
          headers: {
            access_token: `${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // after deleting one comment we are refetching the comments again
        let comments = await axios.post(
          `http://localhost:3001/getComments/${video._id}`,
          commentData,
          {
            headers: {
              access_token: `${token}`,
            },
          }
        );
        setComments(comments);
      } else {
        console.error("Failed to delete comment:", response.status);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <>
      <div className="sticky top-0 bg-white z-50">
        <Header toggleSidebar={handleToggle} />
      </div>

      <div
        className="sidebar-container"
        style={{
          display: isCollapsed ? "block" : "none",
          position: "fixed",
          left: 0,
          width: "220px",
          height: "100vh",
          backgroundColor: "white",
          transition: "transform 0.3s ease",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        <Sidebar />
      </div>

      <div
        className="flex flex-col md:flex-row p-2 space-x-2 overflow-x-hidden scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Video Section */}
        <div className="flex-1 max-w-full bg-white rounded-lg p-4 space-y-6 mx-auto">
          <div className="relative">
            <iframe
              width="853"
              height="480"
              src={embedUrl}
              title="YouTube Video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
            <h1 className="text-2xl font-semibold mb-2">{video.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <img
                src="https://via.placeholder.com/40"
                alt="Channel Logo"
                className="rounded-full"
              />
              <div>
                <h2 className="font-semibold text-lg">{video.channelName}</h2>
                <p className="text-gray-500">{video.subscriber}</p>
              </div>
              <button className="bg-black text-white px-4 sm:px-2 py-2 rounded-lg shadow-md">
                Subscribe
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap space-x-3 mb-4 justify-center sm:justify-start">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
                <BiLike className="text-sm" />{" "}
                <span className="text-xs sm:text-sm">Like</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
                <BiDislike className="text-sm" />{" "}
                <span className="text-xs sm:text-sm">Dislike</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
                <PiShareFatLight className="text-sm" />{" "}
                <span className="text-xs sm:text-sm">Share</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
                <RxDownload className="text-sm" />{" "}
                <span className="text-xs sm:text-sm">Download</span>
              </button>
            </div>

            {/* About this Video */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold">About this Video</h2>
              <p className="text-gray-700 mt-2">{video.description}</p>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <div className="flex space-x-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={addComment}
                  className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                >
                  Post
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex justify-between items-start"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Fallback for image - show first letter of channelName */}
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full text-white font-semibold">
                        {comment.channelName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {comment.channelName}
                        </p>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => deleteComment(comment._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Related Videos */}
        <div className="md:w-1/3 w-full mt-6 md:mt-0">
          <SideVideoGrid />
        </div>
      </div>
    </>
  );
}

export default VideoPlayer;
