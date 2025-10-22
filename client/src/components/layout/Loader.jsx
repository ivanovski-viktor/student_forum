import { useEffect, useState } from "react";

export default function Loader({ loading }) {
  const [visible, setVisible] = useState(loading);
  const [opacity, setOpacity] = useState("opacity-100");

  useEffect(() => {
    if (loading) {
      // show loader immediately
      setVisible(true);
      setOpacity("opacity-100");
    } else {
      // fade out
      setOpacity("opacity-0");
      // remove from DOM after transition (300ms matches tailwind duration-300)
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      className={`flex-col gap-4 flex items-center justify-center h-screen fixed top-0 left-0 w-screen bg-background transition-opacity duration-300 ease-out z-99 ${opacity}`}
    >
      <div className="w-20 h-20 border-4 border-transparent text-primary text-4xl animate-spin flex items-center justify-center border-t-primary rounded-full">
        <div className="w-14 h-14 border-4 border-transparent text-secondary text-2xl animate-spin flex items-center justify-center border-t-secondary-light rounded-full"></div>
      </div>
    </div>
  );
}
