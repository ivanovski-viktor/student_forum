import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import userPlaceholder from "../../assets/user-placeholder.png";
import ReplyToComment from "./ReplyToComment";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Comment({ comment }) {
  const { id, content, user_id } = comment;

  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesCount, setRepliesCount] = useState(0);

  // Fetch user data
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useFetch(`${apiUrl}/users/${user_id}`);

  const user = userData?.user || {};
  const {
    id: userId,
    username: userName,
    profile_image_url: profileImageUrl,
  } = user;

  // Fetch replies count on initial render
  useEffect(() => {
    const fetchRepliesCount = async () => {
      try {
        const res = await fetch(`${apiUrl}/comments/${id}/replies`);
        if (!res.ok) throw new Error("Failed to fetch replies count");
        const json = await res.json();
        setRepliesCount(json.replies?.length || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRepliesCount();
  }, [id]);

  // Function to fetch replies when user expands
  const fetchReplies = async () => {
    try {
      const res = await fetch(`${apiUrl}/comments/${id}/replies`);
      if (!res.ok) throw new Error("Failed to fetch replies");
      const json = await res.json();
      const fetchedReplies = json.replies || [];
      setReplies(fetchedReplies);
      setRepliesCount(fetchedReplies.length); // keep count updated after adding replies
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch replies when showReplies is toggled
  useEffect(() => {
    if (showReplies) fetchReplies();
  }, [showReplies]);

  // Callback when a new reply is added
  const handleReplyAdded = () => {
    fetchReplies();
    setShowReplies(true);
  };

  return (
    <div className="border border-gray-200 p-4 rounded-md">
      {userLoading && <InlineLoader />}
      {userError && <div>Error: {userError}</div>}

      <div>
        <Link
          className="transition-colors duration-200 ease-in-out hover:text-orange-600 flex items-center gap-2 w-max"
          to={`/users/${userId}`}
        >
          <img
            className="rounded-full w-7 h-7 object-cover bg-orange-600"
            src={profileImageUrl || userPlaceholder}
            alt="profile"
          />
          <h6>{userName}</h6>
        </Link>

        <div className="flex items-center justify-between gap-2">
          <p className="mt-2">{content}</p>
          <button
            onClick={() => setShowReplies((prev) => !prev)}
            className="text-xs text-gray-600 underline cursor-pointer hover:opacity-60 transition-opacity duration-200"
          >
            {!showReplies
              ? repliesCount > 0
                ? `Прикажи ${repliesCount} ${
                    repliesCount === 1 ? "одговор" : "одговори"
                  }`
                : "Одговори"
              : "Сокриј"}
          </button>
        </div>

        {showReplies && (
          <div className="mt-2 border-t border-gray-200/80">
            <ReplyToComment
              commentId={id}
              handleReplyAdded={handleReplyAdded}
            />
            {[...replies].reverse().map((reply, index) => (
              <div
                key={reply.id}
                className={`pl-5 mt-2 border-t pt-2 border-gray-200/80${
                  index === 0 ? " !mt-0 border-t-0" : ""
                }`}
              >
                {reply.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
