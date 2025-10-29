import { useEffect, useState, useRef } from "react";

export default function Loader({ loading }) {
  const [visible, setVisible] = useState(true); // in-DOM
  const [fade, setFade] = useState(true); // opacity
  const firstRender = useRef(true);

  useEffect(() => {
    let delayTimer;
    let fadeTimer;

    if (!loading) {
      delayTimer = setTimeout(() => setFade(false), 300);
      fadeTimer = setTimeout(() => setVisible(false), 600);
    } else {
      setVisible(true);
      setFade(true);
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(fadeTimer);
    };
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center h-screen w-screen bg-background z-[99] transition-opacity duration-300 ease-out ${
        firstRender.current ? "opacity-100" : fade ? "opacity-100" : "opacity-0"
      }`}
      ref={() => {
        firstRender.current = false;
      }}
    >
      <div className="w-20 h-20 border-4 border-transparent text-primary text-4xl animate-spin flex items-center justify-center border-t-primary rounded-full">
        <div className="w-14 h-14 border-4 border-transparent text-secondary text-2xl animate-spin flex items-center justify-center border-t-secondary-light rounded-full"></div>
      </div>
    </div>
  );
}
