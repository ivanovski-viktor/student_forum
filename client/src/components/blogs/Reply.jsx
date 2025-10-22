import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import userPlaceholder from "../../assets/user-placeholder.png";
import CreatedAt from "../ui/CreatedAt";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import Message from "../ui/Message";
import ModifyButtons from "../ui/ModifyButtons";
import { useEffect, useState } from "react";
import { useUpdateRequest } from "../../hooks/useUpdateRequest";
import CommentContent from "./CommentContent";

const apiUrl = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export default function Reply({ reply }) {
  const [replyObj, setReplyObj] = useState(reply);
  const [editReply, setEditReply] = useState(false);

  const { id, user_id, content } = replyObj;

  const [contentData, setContentData] = useState(content);

  const replyUrl = `${apiUrl}/comments/${id}`;

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useFetch(`${apiUrl}/users/${user_id}`);

  const user = userData?.user || {};
  const { username, profile_image_url } = user;

  // handle delete reply
  const {
    exec: handleDeleteReply,
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useDeleteRequest(replyUrl, token);

  if (successDelete) {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  // handle update reply
  const {
    exec: handleUpdateReply,
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = useUpdateRequest(replyUrl, token, { ...replyObj, content: contentData });

  useEffect(() => {
    if (successUpdate) {
      setReplyObj((prev) => ({ ...prev, content: contentData }));
      setEditReply(false);
    }
  }, [successUpdate]);

  if (userLoading) return null;
  if (userError)
    return <div className="text-xs text-error">Error loading user</div>;

  return (
    <div className="mt-4 border-t pt-4 border-stroke">
      {errorDelete && <Message type="error" text={errorDelete} />}
      {successDelete && <Message text="Successfully deleted reply!" />}

      <div className=" flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link
            className="transition-colors duration-200 ease-in-out hover:text-primary flex items-center gap-2"
            to={`/users/${user_id}`}
          >
            <img
              className="profile-img"
              src={profile_image_url || userPlaceholder}
              height={30}
              width={30}
              alt="profile"
            />
            <h6>{username}</h6>
          </Link>
          <CreatedAt time={reply.created_at} />
        </div>
        <ModifyButtons
          token={token}
          userId={user_id}
          onClickDelete={handleDeleteReply}
          loadingDelete={loadingDelete}
          onClickEdit={() => {
            setEditReply((prev) => !prev);
            setContentData(replyObj.content);
          }}
          editing={editReply}
        />
      </div>

      <CommentContent
        handleUpdateComment={handleUpdateReply}
        loadingUpdate={loadingUpdate}
        errorUpdate={errorUpdate}
        successUpdate={successUpdate}
        editComment={editReply}
        setEditComment={setEditReply}
        commentObj={replyObj}
        contentData={contentData}
        setContentData={setContentData}
      />
    </div>
  );
}
