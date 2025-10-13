import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import LinkUnderline from "../ui/LinkUnderline";

export default function Home({ children }) {
  // Requires 2 children
  const childArray = React.Children.toArray(children);

  return (
    <div className="grid grid-cols-12 min-h-screen">
      {/* nav menu */}
      <div className="col-span-2 border-r border-gray-200 bg-orange-200/10">
        <div className="p-5">
          <Link to="/">
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </div>
      </div>

      {/* main content */}
      <div className="col-span-6 p-5">{childArray[0]}</div>

      {/* right sidebar */}
      <div className="col-span-4 p-5 pl-0">
        <div className="sticky top-5 min-h-[85svh] gap-5 flex flex-col items-stretch justify-between">
          {childArray[1] && (
            <div className="bg-orange-200/10 rounded-xl p-5 transition-all duration-200 flex h-86 max-h-[50svh] flex-col items-start">
              <ul className="w-full overflow-y-auto">{childArray[1]}</ul>
            </div>
          )}

          <div>
            <ul className="text-sm text-gray-600 space-y-4">
              <li>
                Developed by:{" "}
                <LinkUnderline
                  target="_blank"
                  colorClass={"green-600"}
                  link="https://www.linkedin.com/in/viktor-ivanovski-a47b8426a/"
                  text={"Viktor Ivanovski."}
                />
              </li>
              <li>Student Forum © 2025. All rights reserved.</li>
              <li className="flex items-center justify-start gap-3">
                <FontAwesomeIcon icon={faHome} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
