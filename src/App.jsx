import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazily load the components
const Homepage = lazy(() => import("./components/Homepage"));
const VideoPlayer = lazy(() => import("./components/VideoPlayer"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));

const UserProfile = lazy(() => import("./components/UserProfile"));
const ChannelView = lazy(() => import("./components/Channelview"));
const Error = lazy(() => import("./components/Error"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/channel/:id" element={<ChannelView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
