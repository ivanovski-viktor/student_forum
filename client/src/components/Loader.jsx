import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";

export default function Loader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 900);

    return () => clearTimeout(timer);
  }, [location]);

  let activeClass = "";
  loading
    ? (activeClass = "opacity-100")
    : (activeClass = "transition-opacity duration-300 ease-in");

  return (
    <div
      className={`flex-col gap-4 w-full flex items-center justify-center h-screen fixed top-0 left-0 w-screen bg-white opacity-0 pointer-events-none ${activeClass}`}
    >
      <div className="w-20 h-20 border-4 border-transparent text-orange-600 text-4xl animate-spin flex items-center justify-center border-t-orange-600 rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-green-600 text-2xl animate-spin flex items-center justify-center border-t-green-400 rounded-full"></div>
      </div>
    </div>
  );
}
