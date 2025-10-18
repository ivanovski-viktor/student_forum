import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import userPlaceholder from "../../assets/user-placeholder.png";
import ReplyToComment from "./ReplyToComment";
import Reply from "./Reply";
import { RiArrowDownFill, RiDeleteBinFill, RiPencilFill } from "react-icons/ri";
import CreatedAt from "../ui/CreatedAt";
import ModifyButton from "./ModifyButton";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import Message from "../ui/Message";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Comment({ comment }) {
  const { id, content, user_id } = comment;
  const token = localStorage.getItem("token");
  const commentUrl = `${apiUrl}/comments/${id}`;

  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyToComment, setShowReplyToComment] = useState(false);
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
        const res = await fetch(`${commentUrl}/replies`);
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
      const res = await fetch(`${commentUrl}/replies`);
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
    const loadReplies = async () => {
      if (!showReplies) return;

      setLoadingReplies(true);
      try {
        await fetchReplies();
      } finally {
        setLoadingReplies(false);
      }
    };

    loadReplies();
  }, [showReplies]);

  // Callback when a new reply is added
  const handleReplyAdded = () => {
    fetchReplies();
    setShowReplies(true);
  };

  // handle delete comment
  const {
    exec: handleDeleteComment,
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useDeleteRequest(commentUrl, token);

  if (successDelete) {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  return (
    <div className="border border-stroke p-4 rounded-md">
      {userLoading && <InlineLoader />}
      {userError && <div>Error: {userError}</div>}
      {errorDelete && <Message type="error" text={errorDelete} />}
      {successDelete && <Message text="Successfully deleted comment!" />}
      <div>
        <div className="flex items-center justify-between">
          <div className=" flex items-center gap-1">
            <Link
              className="transition-colors duration-200 ease-in-out hover:text-primary flex items-center gap-2"
              to={`/users/${userId}`}
            >
              <img
                className="profile-img"
                src={profileImageUrl || userPlaceholder}
                width={30}
                height={30}
                alt="profile"
              />
              <h6 className="">{userName}</h6>
            </Link>

            <CreatedAt time={comment.created_at} />
          </div>

          <div className="flex items-center gap-2">
            <ModifyButton>
              <RiPencilFill />
            </ModifyButton>
            <ModifyButton
              onClick={handleDeleteComment}
              extraClass="modify-btn--hvr-red"
              popupText="Избриши"
            >
              {loadingDelete ? (
                <InlineLoader small={true} />
              ) : (
                <RiDeleteBinFill />
              )}
            </ModifyButton>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="mt-2 pl-10">{content}</p>
          <button
            onClick={() => setShowReplies((prev) => !prev)}
            className="text-xs text-foreground-light underline cursor-pointer hover:opacity-60 transition-opacity duration-200 flex items-center gap-1 "
          >
            {loadingReplies ? (
              <InlineLoader small={true} />
            ) : !showReplies ? (
              repliesCount > 0 ? (
                `Прикажи ${repliesCount} ${
                  repliesCount === 1 ? "одговор" : "одговори"
                }`
              ) : (
                "Одговори"
              )
            ) : (
              "Сокриј"
            )}
          </button>
        </div>

        {showReplies && !loadingReplies && (
          <div className="pl-10">
            <div className="flex items-center justify-end mt-2">
              <button
                className="  px-3 py-1 w-28 rounded-full text-foreground-light hover:bg-orange-200 transition-colors duration-300 ease-in-out flex items-center justify-between"
                onClick={() => setShowReplyToComment((prev) => !prev)}
              >
                <RiArrowDownFill
                  className={`transition-transform duration-200 ease-in-out${
                    showReplyToComment ? " rotate-180" : "rotate-0"
                  }`}
                />{" "}
                {!showReplyToComment ? "Одговори" : "Затвори"}
              </button>
            </div>
            {showReplyToComment && (
              <ReplyToComment
                commentId={id}
                handleReplyAdded={handleReplyAdded}
              />
            )}
            {!loadingReplies && (
              <div className="">
                {replies.map((reply, index) => (
                  <Reply
                    key={index}
                    reply={reply}
                    setLoadingReplies={setLoadingReplies}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
