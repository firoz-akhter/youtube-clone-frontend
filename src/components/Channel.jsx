import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const channelInit = { channelName: "", channelDescription: "" }

function Channel() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editChannelId, setEditChannelId] = useState(null);
    const [newChannelData, setNewChannelData] = useState(channelInit);
    console.log("newChannelData", newChannelData)
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        const url = "http://localhost:3001/getUserChannels";
        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = userData.token;
        console.log(token);

        if (!token) return console.error("Token not found in localStorage");

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { access_token: `${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("data", data.ownedChannels);
                setChannels(data.ownedChannels);
            } else {
                console.error("Failed to fetch channels:", response.status);
            }
        } catch (error) {
            console.error("Error fetching channels:", error);
        }
    };

    const toggleForm = () => {
        setIsOpen(!isOpen);
        setIsEditing(false);
        resetForm();
    };

    const resetForm = () => {
        setNewChannelData(channelInit);
    };

    const handleCreateChannel = async (event) => {
        event.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");
        const url = "http://localhost:3001/addChannel";

        const data = { channelName: newChannelData.channelName, description: newChannelData.channelDescription };
        console.log("data", data);

        if (!token) return console.error("Token not found in localStorage");

        try {
            const response = await axios.post(url, data, {
                headers: {
                    access_token: `${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("response", response);
            if (!response) {
                alert("something went wrong while creating channel...");
            }

            fetchChannels();

            resetForm();
            setIsOpen(false);
            setLoading(false);
        } catch (error) {
            console.error("Error creating channel:", error);
            setLoading(false);
        }
    };

    const handleUpdateChannel = async (event) => {
        event.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");
        const id = editChannelId;
        const url = `http://localhost:3001/updateChannel/${id}`;
        // http://localhost:3001/updateChannel/678265be6b47463bd557f0f2

        const data = {
            channelName: newChannelData.channelName,
            description: newChannelData.channelDescription
        };

        if (!token) return console.error("Token not found in localStorage");

        try {
            const response = await axios.put(url, data, {
                headers: {
                    access_token: `${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("response", response);

            // const updatedChannels = channels.map((channel) =>
            //     channel._id === editChannelId
            //         ? { ...channel, channelName, channelDescription }
            //         : channel
            // );
            // setChannels(updatedChannels);
            fetchChannels();

            resetForm();
            setIsOpen(false);
            setLoading(false);
        } catch (error) {
            console.error("Error updating channel:", error);
            setLoading(false);
        }
    };

    const deleteChannel = async (channelId) => {
        const id = channelId;
        const url = `http://localhost:3001/deleteChannel/${id}`;
        const token = localStorage.getItem("token");

        if (!token) return console.error("Token not found in localStorage");

        try {
            await axios.delete(url, { headers: { access_token: `${token}` } });
            // setChannels(channels.filter((channel) => channel._id !== channelId));
            fetchChannels();
        } catch (error) {
            console.error("Error deleting channel:", error);
        }
    };

    const editChannel = (channelId, name, description) => {
        console.log("channelId, name, descirption", channelId, name, description);
        setIsOpen(true);
        setIsEditing(true);
        setEditChannelId(channelId);
        setNewChannelData({channelName: name, channelDescription: description})
        // setChannelName(name);
        // setChannelDescription(description);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Manage Channels</h1>

            <div className="text-center">
                <button
                    onClick={toggleForm}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg mb-4"
                >
                    Create Channel
                </button>
            </div>

            <div className="mt-10 flex justify-center flex-wrap" >
                {channels.map((channel) => (
                    <div
                        key={channel._id}
                        // max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden
                        className="bg-white m-2 p-6 rounded-lg shadow-lg border text-center w-full h-full min-h-[200px] max-w-[300px] sm:w-[350px] lg:w-[400px]"
                    >
                        <h3 className="text-2xl font-semibold text-gray-800">{channel.channelName}</h3>
                        <p className="text-gray-600 mt-2">{channel.channelDescription}</p>
                        <div className="mt-4">
                            <button
                                onClick={() => deleteChannel(channel._id)}
                                className="text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() =>
                                    editChannel(channel._id, channel.channelName, channel.description)
                                }
                                className="text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => navigate(`/channel/${channel._id}`)}
                                className="text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                            >
                                View Channel
                            </button>
                        </div>
                    </div>
                ))}
            </div>



            {isOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 relative">
                        <button
                            onClick={toggleForm}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>

                        {isEditing ? (
                            <form onSubmit={handleUpdateChannel}>
                                <h2 className="text-xl font-semibold mb-4">Edit Channel</h2>
                                <div className="mb-4">
                                    <label htmlFor="channelName" className="block text-gray-700 font-semibold">
                                        Channel Name
                                    </label>
                                    <input
                                        type="text"
                                        id="channelName"
                                        // value={channelName}
                                        value={newChannelData.channelName}
                                        onChange={(e) =>
                                            setNewChannelData({ ...newChannelData, channelName: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                        placeholder="Enter channel name"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="channelDesc" className="block text-gray-700 font-semibold">
                                        Channel Description
                                    </label>
                                    <textarea
                                        id="channelDesc"
                                        value={newChannelData.channelDescription}
                                        onChange={(e) =>
                                            setNewChannelData({ ...newChannelData, channelDescription: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                        placeholder="Enter channel description"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-green-500 text-white px-4 py-2 rounded-lg mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? "Updating..." : "Update Channel"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleCreateChannel}>
                                <h2 className="text-xl font-semibold mb-4">Create Channel</h2>
                                <div className="mb-4">
                                    <label htmlFor="channelName" className="block text-gray-700 font-semibold">
                                        Channel Name
                                    </label>
                                    <input
                                        type="text"
                                        id="channelName"
                                        value={newChannelData.channelName}
                                        onChange={(e) => setNewChannelData({ ...newChannelData, channelName: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                        placeholder="Enter channel name"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="channelDesc" className="block text-gray-700 font-semibold">
                                        Channel Description
                                    </label>
                                    <textarea
                                        id="channelDesc"
                                        value={newChannelData.channelDescription}
                                        onChange={(e) => setNewChannelData({ ...newChannelData, channelDescription: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                        placeholder="Enter channel description"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-green-500 text-white px-4 py-2 rounded-lg mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? "Submitting..." : "Create Channel"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Channel;
