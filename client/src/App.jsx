import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Loader from "./components/Loader.jsx";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 900);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div>
      {
        <Loader
          activeClass={
            loading ? "opacity-100" : "transition-opacity duration-300 ease-in"
          }
        />
      }

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
