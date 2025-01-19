import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiLike, BiDislike } from "react-icons/bi";
import { PiShareFatLight } from "react-icons/pi";
import { RxDownload } from "react-icons/rx";
import SideVideoGrid from "./SideVideoGrid";
import Header from "../components/Header";
import Sidebar from "./Sidebar";
import axios from "axios"; // Import axios
import { GrChannel } from "react-icons/gr";

function VideoPlayer() {
  const { id } = useParams(); // Get the video ID from the URL
  const [video, setVideo] = useState(null);
  console.log("video", video);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [comments, setComments] = useState([]); // Initialize comments state
  const [newComment, setNewComment] = useState("");
  const [editCommentText, setEditCommentText] = useState({
    commentId: "",
    text: "",
  });
  console.log("editCommentText", editCommentText);
  const [editCommentPop, setEditCommentPop] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let userData = localStorage.getItem("userData");
  userData = JSON.parse(userData);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    // thi api call will also increment the views on backend
    const url = `http://localhost:3001/getVideo/${id}`;

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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching video:", error);
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

  const addComment = async () => {
    if (!newComment.trim()) return alert("Comment cannot be empty");

    // let user = JSON.parse(localStorage.getItem("userData"));
    let token = localStorage.getItem("token");
    const commentData = {
      text: newComment,
      // userId: user._id, // Replace with actual user ID
      // videoId: video._id,
    };

    // console.log("trying to add comment");
    // console.log("videoId", video._id);
    // console.log("commentData", commentData);

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

      setNewComment("");

      // console.log("response", response);

      if (response.status === 201) {
        let comments = await axios.get(
          `http://localhost:3001/getComments/${video._id}`,
          commentData,
          {
            headers: {
              access_token: `${token}`,
            },
          }
        );
        setComments(comments.data);
      } else {
        console.error("Failed to post comment:", response.status);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const editComment = async () => {
    let commentId = editCommentText.commentId;
    console.log("trying to edit comment with commentId", commentId);
    // return;
    // if (!editCommentText.trim()) return alert("Comment cannot be empty");

    // let user = JSON.parse(localStorage.getItem("userData"));
    let token = localStorage.getItem("token");
    const commentData = {
      text: editCommentText.text,
      // userId: user._id, // Replace with actual user ID
      // videoId: video._id,
    };

    // console.log("trying to add comment");
    // console.log("videoId", video._id);
    // console.log("commentData", commentData);

    try {
      const response = await axios.put(
        `http://localhost:3001/editComment/${commentId}`,
        commentData,
        {
          headers: {
            access_token: `${token}`,
          },
        }
      );

      setEditCommentText({
        commentId: "",
        text: "",
      });

      // console.log("response", response);

      if (response.status === 200) {
        let comments = await axios.get(
          `http://localhost:3001/getComments/${video._id}`,
          commentData,
          {
            headers: {
              access_token: `${token}`,
            },
          }
        );
        setEditCommentPop((prev) => !prev);
        setComments(comments.data);
      } else {
        console.error("Failed to edit comment:", response.status);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    let token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:3001/deleteComment/${commentId}`,
        {
          headers: {
            access_token: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        // after deleting one comment we are refetching the comments again
        let comments = await axios.get(
          `http://localhost:3001/getComments/${video._id}`,
          {
            headers: {
              access_token: `${token}`,
            },
          }
        );
        setComments(comments.data);
      } else {
        console.error("Failed to delete comment:", response.status);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  async function incrementLike() {
    const endpoint = `http://localhost:3001/like/${video._id}`;
    let token = localStorage.getItem("token");

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          access_token: `${token}`,
        },
      });

      if (response.ok) {
        // const data = await response.json(); // Assuming the server returns JSON
        fetchVideo();

        console.log("Video liked successfully!");
      } else {
        console.error("Failed to like the video:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while liking the video:", error);
    }
  }

  async function decrementLike() {
    const endpoint = `http://localhost:3001/dislike/${video._id}`;
    let token = localStorage.getItem("token");

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          access_token: `${token}`,
        },
      });

      if (response.ok) {
        // const data = await response.json(); // Assuming the server returns JSON
        fetchVideo();

        console.log("Video dislike successfully!");
      } else {
        console.error("Failed to dislike the video:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while disliking the video:", error);
    }
  }

  async function subscribeChannel() {
    let channelId = video.channelId._id;

    const endpoint = `http://localhost:3001/subscribe/${channelId}`;
    let token = localStorage.getItem("token");

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          access_token: `${token}`,
        },
      });

      if (response.ok) {
        let data = await response.json();
        // console.log("response", data);
        // const data = await response.json(); // Assuming the server returns JSON
        fetchVideo();

        console.log(data.message);
      } else {
        console.error("Failed to subscribe the channel:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while subscribing the channel:", error);
    }
  }

  function openPopup(text, commentId) {
    setEditCommentPop((prev) => !prev);
    let data = { commentId: commentId, text: text };
    setEditCommentText(data);
  }

  const handleOutsideClick = (e) => {
    if (e.target.id === "overlay") {
      setEditCommentPop((prev) => !prev);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <div className="">
      <div className="sticky top-0 bg-white z-50">
        <Header setIsCollapsed={setIsCollapsed} />
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
              src={`${video.videoUrl}?autoplay=1&cc_load_policy=1`}
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
            <h1 className="text-2xl font-semibold mb-2">{video.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <GrChannel className="rounded-full bg-gray-300 p-1" size={35} />
              <div className="flex justify-center items-center">
                <h2 className="font-semibold text-lg">{video.channelName}</h2>
                <h2 className="text-gray-950 text-xl px-2 border rounded bg-gray-400 m-2">
                  {video.channelId.subscribedUsers.length}
                </h2>
              </div>
              <button
                onClick={subscribeChannel}
                className="bg-black text-white px-4 sm:px-2 py-2 rounded-lg shadow-md"
              >
                Subscribe
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap space-x-3 mb-4 justify-center sm:justify-start">
              <button
                onClick={incrementLike}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-500"
              >
                <BiLike className="text-sm" />{" "}
                <span className="text-xs sm:text-sm">Like</span>
                <span>{video.likes.length}</span>
              </button>
              <button
                onClick={decrementLike}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-500"
              >
                <BiDislike className="text-sm" />{" "}
                <span className="text-xs sm:text-sm">Dislike</span>
                <span>{video.dislikes.length}</span>
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
                        {/* {comment.channelName.charAt(0).toUpperCase()} */}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {comment.channelName}
                        </p>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {comment.userId._id == userData._id && (
                        <>
                          <button
                            className="px-6 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            // onClick={() => editComment(comment._id)}
                            onClick={() => openPopup(comment.text, comment._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-6 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                            onClick={() => deleteComment(comment._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Related Videos */}
        <div className="md:w-1/3 w-full mt-6 md:mt-0 overflow-hidden">
          <SideVideoGrid />
        </div>
      </div>
      {editCommentPop && (
        <div
          id="overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleOutsideClick}
        >
          {/* Modal Content */}
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Edit your comment</h2>
            <input
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              type="text"
              value={editCommentText.text}
              onChange={(e) => {
                setEditCommentText((prev) => ({
                  ...prev,
                  text: e.target.value,
                }));
              }}
            />
            <button
              onClick={editComment}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
