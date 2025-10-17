import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Loader() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true); // controls if the loader is in DOM
  const [opacity, setOpacity] = useState("opacity-100"); // tailwind opacity class

  useEffect(() => {
    // Start loading on route change
    setLoading(true);
    setVisible(true);
    setOpacity("opacity-100");

    const randomDelay = Math.floor(Math.random() * (1500 - 800 + 1)) + 800;

    const timer = setTimeout(() => {
      // Fade out
      setOpacity("opacity-0");

      // Remove from DOM after fade duration (300ms)
      setTimeout(() => {
        setVisible(false);
        setLoading(false);
      }, 300);
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [location]);

  if (!visible) return null;

  return (
    <div
      className={`flex-col gap-4 flex items-center justify-center h-screen fixed top-0 left-0 w-screen bg-white transition-opacity duration-300 ease-out z-50 ${opacity}`}
    >
      <div className="w-20 h-20 border-4 border-transparent text-primary text-4xl animate-spin flex items-center justify-center border-t-primary rounded-full">
        <div className="w-14 h-14 border-4 border-transparent text-secondary text-2xl animate-spin flex items-center justify-center border-t-green-400 rounded-full"></div>
      </div>
    </div>
  );
}
