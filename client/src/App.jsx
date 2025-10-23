import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Loader from "./components/layout/Loader.jsx";
import NavBar from "./components/layout/NavBar.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import MyAccount from "./pages/MyAccount.jsx";
import UserAccount from "./pages/UserAccount.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import Group from "./pages/Group.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useState } from "react";
import AllGroups from "./pages/AllGroups.jsx";

function App() {
  return (
    <div>
      <NavBar />
      <main>
        <Routes>
          {/* User routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/:id" element={<UserAccount />} />
          <Route path="/users/me" element={<MyAccount />} />
          <Route
            path="/users/me/change-password"
            element={<ChangePassword />}
          />
          {/* Posts */}
          <Route path="/posts/:id" element={<BlogPost />} />
          {/* Groups */}
          <Route path="/groups" element={<AllGroups />} />
          <Route path="/groups/:name" element={<Group />} />
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
