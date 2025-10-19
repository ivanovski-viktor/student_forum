import { useEffect, useState } from "react";
import { RiArrowUpFill, RiArrowDownFill, RiMessage2Line } from "react-icons/ri";
const apiUrl = import.meta.env.VITE_API_URL;

export default function BlogPostStatsBar({ post }) {
  const votesUrl = `${apiUrl}/posts/${post.id}/votes`;
  const token = localStorage.getItem("token");
  const [activeVote, setActiveVote] = useState(null);

  const upvotes = post.upvotes + (activeVote === 1 ? 1 : 0);
  const downvotes = post.downvotes + (activeVote === -1 ? 1 : 0);

  function handlePostVote(vote) {
    setActiveVote((prev) => (prev === vote ? null : vote));
  }

  return (
    <div className="flex flex-wrap gap-4 gap-y-2 text-sm text-foreground items-center ">
      <div className="flex items-center gap-1 bg-foreground/10 p-1 rounded-full relative">
        <button
          type="button"
          onClick={() => handlePostVote(1)}
          className={`vote-btn ${activeVote === 1 && "active"}`}
        >
          <RiArrowUpFill className="shrink-0" />
          <span className="text-xs">{upvotes}</span>
        </button>
        <button
          type="button"
          onClick={() => handlePostVote(-1)}
          className={`vote-btn ${activeVote === -1 && "active"}`}
        >
          <RiArrowDownFill className="shrink-0" />
          <span className="text-xs">{downvotes}</span>
        </button>
      </div>
      <span className="flex items-center gap-1">
        <RiMessage2Line />
        <span className="text-xs">{post.comment_count}</span>
      </span>
    </div>
  );
}
