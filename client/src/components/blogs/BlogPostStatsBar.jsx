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

  if (isAuthenticated) {
    const { data: voteData, loading: voteLoading } = useFetch(voteUrl, {
      headers: { "Content-Type": "application/json", Authorization: token },
    });

    const userVote = voteData?.vote_type;
    // Initialize active vote based on user data from API
    useEffect(() => {
      setVoteLoading(true);
      if (userVote) {
        setActiveVote(userVote);
        setVoteLoading(false);
      } else {
        setVoteLoading(false);
      }
    }, [userVote]);
  }
  const { exec: deleteVote } = useDeleteRequest(voteUrl, token);
  const { exec: postVote } = usePostRequest(voteUrl, token);

  function handlePostVote(vote) {
    // Wait until auth check is done
    if (!checkedAuth) return;

    // Redirect to login if user is not authenticated
    if (!isAuthenticated) {
      navigate("/login");
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

    // Adjust counts for new vote
    vote === 1 && setUpvotes((u) => u + 1);
    vote === -1 && setDownvotes((d) => d + 1);
    activeVote === 1 && setUpvotes((u) => u - 1);
    activeVote === -1 && setDownvotes((d) => d - 1);

    setActiveVote(vote);
    postVote({ vote_type: vote });
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 gap-y-2 text-sm text-foreground items-center ">
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
              <InlineLoader small={true} />
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
              <InlineLoader small={true} />
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
    </>
  );
}
