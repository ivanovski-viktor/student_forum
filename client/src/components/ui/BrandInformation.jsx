import { Github, Linkedin } from "lucide-react";
import React from "react";
import LinkUnderline from "./LinkUnderline";

export default function BrandInformation() {
  return (
    <>
      <ul className="text-sm text-foreground-light space-y-4 2xl:mr-20">
        <li className="flex items-center justify-start gap-3">
          <a
            href="https://github.com/ivanovski-viktor/student_forum"
            target="blank"
            className="bg-foreground text-background h-7 w-7 flex items-center justify-center rounded-full border border-foreground hover:text-foreground hover:bg-background transition-colors duration-200 ease-in-out"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/viktor-ivanovski-a47b8426a/"
            target="blank"
            className="bg-foreground text-background h-7 w-7 flex items-center justify-center rounded-full border border-foreground hover:text-foreground hover:bg-background transition-colors duration-200 ease-in-out"
          >
            <Linkedin size={16} />
          </a>
        </li>
        <li>
          Developed by:{" "}
          <LinkUnderline
            target="_blank"
            link="https://www.linkedin.com/in/viktor-ivanovski-a47b8426a/"
            text="Viktor Ivanovski."
          />
        </li>
        <li>
          Student Forum © {new Date(Date.now()).getFullYear()}. All rights
          reserved.
        </li>
      </ul>
    </>
  );
}
