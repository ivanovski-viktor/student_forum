import { Image } from "lucide-react";
import React from "react";

export default function Banner({ img_url, text }) {
  return (
    <div className="p-8 pb-12 border border-stroke rounded-xl shadow-sm relative min-h-36 overflow-hidden">
      {img_url ? (
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={img_url}
          alt="Group cover image."
        />
      ) : (
        <Image className="absolute top-0 left-0 w-full h-full object-cover" />
      )}

      <div className="absolute top-0 left-0 w-full h-full bg-foreground/40"></div>
      <p className="relative font-semibold text-balance text-background text-lg">
        {text}
      </p>
    </div>
  );
}
