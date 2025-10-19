import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import userPlaceholder from "../../assets/user-placeholder.png";
import ReplyToComment from "./ReplyToComment";
import Reply from "./Reply";
import CreatedAt from "../ui/CreatedAt";
import ModifyButtons from "../ui/ModifyButtons";
import Message from "../ui/Message";
import CommentContent from "./CommentContent";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import { useUpdateRequest } from "../../hooks/useUpdateRequest";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Comment({ comment }) {
  const token = localStorage.getItem("token");

  // --- Local state ---
  const [commentObj, setCommentObj] = useState(comment);
  const [editComment, setEditComment] = useState(false);
  const [contentData, setContentData] = useState(comment.content);

  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplyToComment, setShowReplyToComment] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesCount, setRepliesCount] = useState(0);

  const { id, user_id } = commentObj;
  const commentUrl = `${apiUrl}/comments/${id}`;

  // --- Fetch user data ---
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useFetch(`${apiUrl}/users/${user_id}`);

  const user = userData?.user || {};
  const { username, profile_image_url } = user;

  // --- Delete comment ---
  const {
    exec: handleDeleteComment,
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useDeleteRequest(commentUrl, token);

  // --- Update comment ---
  const {
    exec: handleUpdateComment,
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useUpdateRequest(commentUrl, token, {
    ...commentObj,
    content: contentData,
  });

  // --- Update local state on success ---
  useEffect(() => {
    if (successUpdate) {
      setCommentObj((prev) => ({ ...prev, content: contentData }));
      setEditComment(false);
    }
  }, [successUpdate]);

  // --- Fetch replies count ---
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

  // --- Fetch replies ---
  const fetchReplies = async () => {
    try {
      const res = await fetch(`${commentUrl}/replies`);
      if (!res.ok) throw new Error("Failed to fetch replies");
      const json = await res.json();
      setReplies(json.replies || []);
      setRepliesCount((json.replies || []).length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!showReplies) return;
    const loadReplies = async () => {
      setLoadingReplies(true);
      try {
        await fetchReplies();
      } finally {
        setLoadingReplies(false);
      }
    };
    loadReplies();
  }, [showReplies]);

  const handleReplyAdded = () => {
    fetchReplies();
    setShowReplies(true);
  };

  if (userLoading) return <InlineLoader />;
  if (userError)
    return <div className="text-xs text-error">Error loading user</div>;

  return (
    <div className="border border-stroke p-4 rounded-md">
      {errorDelete && <Message type="error" text={errorDelete} />}
      {successDelete && <Message text="Successfully deleted comment!" />}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link
            to={`/users/${user_id}`}
            className="transition-colors duration-200 ease-in-out hover:text-primary flex items-center gap-2"
          >
            <img
              className="profile-img"
              src={profile_image_url || userPlaceholder}
              width={30}
              height={30}
              alt="profile"
            />
            <h6>{username}</h6>
          </Link>
          <CreatedAt time={commentObj.created_at} />
        </div>

        <ModifyButtons
          token={token}
          userId={user_id}
          onClickDelete={handleDeleteComment}
          loadingDelete={loadingDelete}
          onClickEdit={() => {
            setEditComment((prev) => !prev);
            setContentData(commentObj.content);
          }}
          editing={editComment}
        />
      </div>

      <CommentContent
        handleUpdateComment={handleUpdateComment}
        loadingUpdate={loadingUpdate}
        errorUpdate={errorUpdate}
        successUpdate={successUpdate}
        editComment={editComment}
        setEditComment={setEditComment}
        commentObj={commentObj}
        contentData={contentData}
        setContentData={setContentData}
      />

      <div className="flex items-center justify-end gap-2 mt-1">
        <button
          onClick={() => setShowReplies((prev) => !prev)}
          className="btn-underline"
        >
          {loadingReplies ? (
            <InlineLoader small />
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
          <div className=" mb-2">
            <ReplyToComment
              commentId={id}
              handleReplyAdded={handleReplyAdded}
            />
          </div>
          <div>
            {replies.map((reply, idx) => (
              <Reply
                key={idx}
                reply={reply}
                setLoadingReplies={setLoadingReplies}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
