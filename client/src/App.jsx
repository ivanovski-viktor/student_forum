import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Loader from "./components/layout/Loader.jsx";
import NavBar from "./components/layout/NavBar.jsx";
import BlogPost from "./pages/BlogPost.jsx";

function App() {
  return (
    <div>
      <Loader />

      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts/:id" element={<BlogPost />} />
      </Routes>
    </div>
  );
}

export default App;
