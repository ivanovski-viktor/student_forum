import { Link } from "react-router-dom";
import CreatedAt from "../ui/CreatedAt";
import BlogPostStatsBar from "./BlogPostStatsBar";
import { Users } from "lucide-react";
import BlogPostMedia from "./BlogPostMedia";

function filterText(html, maxLength = 300) {
  if (!html) return "";

  // Strip HTML
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = div.textContent || div.innerText || "";

  // Truncate
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export default function BlogPostCard({ post }) {
  const truncatedText = filterText(post.description, 200);

  return (
    <li>
      <div className="bg-box border border-stroke rounded-xl p-5 hover:bg-box hover:shadow-sm transition-all duration-200 flex flex-col items-start relative">
        <Link
          className="absolute top-0 left-0 w-full h-full z-0"
          to={`/posts/${post.id}`}
        ></Link>
        <div className="flex items-center gap-2">
          {!post.group_name ? (
            <span className="text-sm text-foreground-light mb-1 inline-flex gap-1 items-center">
              <Users size={20} />
              <span>/general</span>
            </span>
          ) : (
            <Link
              to={`/groups/${post.group_name}`}
              className="text-sm text-primary hover:underline mb-1 inline-flex gap-1 items-center relative z-10"
            >
              <Users size={20} />
              <span>/{post.group_name}</span>
            </Link>
          )}
          <CreatedAt time={post.created_at} />
        </div>

        <Link to={`/posts/${post.id}`}>
          <h3 className="hover:text-primary transition-colors duration-200 ease-in-out mb-3 mt-3 relative z-10">
            {post.title}
          </h3>
        </Link>

        <p className="mb-4 text-foreground-light">{truncatedText}</p>
        <BlogPostMedia media={post.media} />

        <BlogPostStatsBar post={post} />
      </div>
    </li>
  );
}
