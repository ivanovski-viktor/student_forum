import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import { usePostRequest } from "../../hooks/usePostRequest";
import { useNavigate } from "react-router-dom";
import InlineLoader from "../layout/InlineLoader";
import { useAuthUser } from "../../context/AuthUserContext";
import { ArrowDown, ArrowUp, MessageCircleMore } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function BlogPostStatsBar({ post }) {
  const navigate = useNavigate();
  const { isAuthenticated, checkedAuth } = useAuthUser();
  const token = localStorage.getItem("token");

  const [activeVote, setActiveVote] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);

  const voteUrl = `${apiUrl}/posts/${post.id}/vote`;

  const { data: voteData } = useFetch(
    isAuthenticated ? voteUrl : null, // fetch only if authenticated
    {
      headers: { "Content-Type": "application/json", Authorization: token },
    }
  );

  const userVote = voteData?.vote_type;

  useEffect(() => {
    if (!userVote) return;
    setActiveVote(userVote);
  }, [userVote]);

  const { exec: deleteVote } = useDeleteRequest(voteUrl, token);
  const { exec: postVote } = usePostRequest(voteUrl, token);

  function handlePostVote(vote) {
    if (!checkedAuth) return;
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // Undo same vote
    if (activeVote === vote) {
      vote === 1 && setUpvotes((u) => u - 1);
      vote === -1 && setDownvotes((d) => d - 1);
      setActiveVote(null);
      deleteVote();
      return;
    }

    // Adjust counts
    vote === 1 && setUpvotes((u) => u + 1);
    vote === -1 && setDownvotes((d) => d + 1);
    activeVote === 1 && setUpvotes((u) => u - 1);
    activeVote === -1 && setDownvotes((d) => d - 1);

    setActiveVote(vote);
    postVote({ vote_type: vote });
  }

  return (
    <div className="flex flex-wrap gap-4 gap-y-2 text-sm text-foreground items-center mt-5">
      <div className="flex items-center gap-1 bg-foreground/10 p-1 rounded-full relative">
        <button
          type="button"
          onClick={() => handlePostVote(1)}
          className={`vote-btn ${activeVote === 1 && "active"}`}
        >
          <div className="shrink-0">
            <ArrowUp size={12} />
          </div>
          {voteLoading ? (
            <InlineLoader small />
          ) : (
            <span className="text-xs">{upvotes}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handlePostVote(-1)}
          className={`vote-btn ${activeVote === -1 && "active"}`}
        >
          <div className="shrink-0">
            <ArrowDown size={12} />
          </div>
          {voteLoading ? (
            <InlineLoader small />
          ) : (
            <span className="text-xs">{downvotes}</span>
          )}
        </button>
      </div>
      <span className="flex items-center gap-1">
        <MessageCircleMore size={18} />
        <span className="text-xs">{post.comment_count}</span>
      </span>
    </div>
  );
}
