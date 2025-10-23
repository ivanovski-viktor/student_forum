import React from "react";
import { Link } from "react-router-dom";
import LinkUnderline from "../ui/LinkUnderline";
import { House } from "lucide-react";

export default function Home({ children }) {
  // Requires 2 children
  const childArray = React.Children.toArray(children);

  return (
    <div className="grid grid-cols-12 min-h-screen">
      {/* nav menu */}
      <div className="col-span-2 border-r border-stroke bg-box">
        <div className="p-5">
          <Link to="/" className=" flex items-center gap-2">
            <div className="text-lg">
              <House size={20} />
            </div>
            Home
          </Link>
        </div>
      </div>

      {/* main content */}
      <div className="col-span-6 p-5">{childArray[0]}</div>

      {/* right sidebar */}
      <div className="col-span-4 p-5 pl-0">
        <div className="sticky top-5 min-h-[85svh] gap-5 flex flex-col items-stretch justify-between">
          {childArray[1] && (
            <div className="bg-box rounded-xl p-5 transition-all duration-200 flex h-86 max-h-[50svh] flex-col items-start">
              <ul className="w-full overflow-y-auto">{childArray[1]}</ul>
            </div>
          )}

          <div>
            <ul className="text-sm text-foreground-light space-y-4">
              <li>
                Developed by:{" "}
                <LinkUnderline
                  target="_blank"
                  link="https://www.linkedin.com/in/viktor-ivanovski-a47b8426a/"
                  text={"Viktor Ivanovski."}
                />
              </li>
              <li>Student Forum © 2025. All rights reserved.</li>
              <li className="flex items-center justify-start gap-3">
                <House size={20} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
