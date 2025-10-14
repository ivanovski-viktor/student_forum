import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import userPlaceholder from "../../assets/user-placeholder.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import ReplyToComment from "./ReplyToComment";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Comment({ comment }) {
  // Data
  const { id, content, user_id, replies } = comment;
  const repliesCount = replies?.length || 0;

  // State
  const [showReplies, setShowReplies] = useState(false);
  const [repliesArr, setRepliesArr] = useState(replies);
  // TODO Rework this to fetch replies, create replies endpoint because of need of deleting or updating with database generated id
  const {
    data: userData,
    loading,
    error,
  } = useFetch(`${apiUrl}/users/${user_id}`);

  if (loading) return <InlineLoader />;
  if (error) return <div>Error: {error}</div>;
  const {
    id: userId,
    username: userName,
    profile_image_url: profileImageUrl,
  } = userData.user;

  return (
    <div className=" border border-gray-200 p-4 rounded-md">
      <div>
        <div className="">
          <Link
            className=" transition-colors duration-200 ease-in-out hover:text-orange-600 flex items-center justify-start gap-2 w-max max-w-full"
            to={`/users/${userId}`}
          >
            <img
              className="rounded-full w-7 h-7 object-cover object-center bg-orange-600"
              src={profileImageUrl || userPlaceholder}
              width={1200}
              alt="profile image"
              loading="eager"
            />

            <h6>{userName}</h6>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="mt-2">{content}</p>
          {repliesCount > 0 && (
            <button
              onClick={() => setShowReplies((prev) => !prev)}
              className="text-xs text-gray-600 underline-offset-2 cursor-pointer underline hover:opacity-60 transition-opacity duration-200 ease-in-out"
            >
              {showReplies === false ? (
                <span>
                  Прикажи {repliesCount}{" "}
                  {repliesCount == 1 ? "одговор" : "одговори"}
                </span>
              ) : (
                <span> Сокриј </span>
              )}
            </button>
          )}
        </div>
      </div>
      {showReplies && (
        <div>
          {repliesArr && (
            <div className="pl-5 mt-2 border-t border-gray-200">
              {repliesArr.map((reply, index) => (
                <div
                  className={`pl-5 mt-2 border-t pt-2 border-gray-200${
                    index === 0 ? " !mt-0 border-t-0" : ""
                  }`}
                  key={reply.id}
                >
                  {reply.content}
                </div>
              ))}
              <ReplyToComment
                repliesArr={repliesArr}
                setRepliesArr={setRepliesArr}
                commentId={id}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
