import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Loader from "./components/Loader.jsx";

function App() {
  return (
    <div>
      <Loader />

      <nav className="p-4 border-b border-gray-200 flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
