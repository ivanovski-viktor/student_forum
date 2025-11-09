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
import InlineLoader from "../layout/InlineLoader";
import User from "../users/User";

const apiUrl = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export default function Reply({ reply, refetchReplies }) {
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
    if (successDelete) {
      refetchReplies();
    }
  }, [successUpdate, successDelete, refetchReplies]);

  if (userLoading) return null;
  if (userError)
    return <div className="text-xs text-error">Error loading user</div>;

  return (
    <div className="mt-4 border-t pt-4 border-stroke">
      {errorDelete && <Message type="error" text={errorDelete} />}
      <div className=" flex items-center justify-between">
        <div className="flex items-center gap-1">
          <User
            username={username}
            userId={user_id}
            profileImage={profile_image_url || userPlaceholder}
          />
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
