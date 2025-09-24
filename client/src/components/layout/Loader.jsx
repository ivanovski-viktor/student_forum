import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Loader() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const randomDelay = Math.floor(Math.random() * (800 - 300 + 1)) + 300;
    const timer = setTimeout(() => setLoading(false), randomDelay);

    return () => clearTimeout(timer);
  }, [location]);

  if (!loading) return null;

  return (
    <div className="flex-col gap-4 w-full flex items-center justify-center h-screen fixed top-0 left-0 w-screen bg-white opacity-100 transition-opacity duration-300 ease-in z-50">
      <div className="w-20 h-20 border-4 border-transparent text-orange-600 text-4xl animate-spin flex items-center justify-center border-t-orange-600 rounded-full">
        <div className="w-14 h-14 border-4 border-transparent text-green-600 text-2xl animate-spin flex items-center justify-center border-t-green-400 rounded-full"></div>
      </div>
    </div>
  );
}
