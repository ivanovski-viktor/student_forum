import {
  RiArrowUpFill,
  RiArrowDownFill,
  RiMessage2Line,
  RiGroup2Fill,
  RiPencilFill,
  RiDeleteBinFill,
} from "react-icons/ri";

import CreatedAt from "../ui/CreatedAt";
import ModifyButton from "./ModifyButton";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import InlineLoader from "../layout/InlineLoader";
import Message from "../ui/Message";
import { useNavigate } from "react-router-dom";

export default function BlogPostMain({ post, postUrl }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const {
    exec: handleDeletePost,
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useDeleteRequest(postUrl, token);

  if (successDelete) {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!post.group_name ? (
            <span className="text-sm text-foreground-light mb-1 inline-flex gap-1 items-center">
              <RiGroup2Fill className="text-lg" />
              <span>/general</span>
            </span>
          ) : (
            <span className="text-sm text-foreground-light mb-1 inline-flex gap-1 items-center">
              <RiGroup2Fill className="text-lg" />

              <span>/{post.group_name}</span>
            </span>
          )}

          <CreatedAt time={post.created_at} />
        </div>
        <div className="flex items-center gap-2">
          <ModifyButton>
            <RiPencilFill />
          </ModifyButton>
          <ModifyButton
            onClick={handleDeletePost}
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
      {errorDelete && <Message type="error" text={errorDelete} />}
      {successDelete && <Message text="Successfully deleted post!" />}
      <h2 className="mb-2">{post.title}</h2>
      <p className="text-foreground-light mb-4 text-sm">{post.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-foreground-light items-center">
        <span className="flex items-center gap-1">
          <RiArrowUpFill />
          {post.upvotes}
        </span>
        <span className="flex items-center gap-1">
          <RiArrowDownFill />
          {post.downvotes}
        </span>
        <span className="flex items-center gap-1">
          <RiMessage2Line />
          {post.comment_count} comments
        </span>
      </div>
    </div>
  );
}
