import { RiGroup2Fill } from "react-icons/ri";
import DOMPurify from "dompurify";

import CreatedAt from "../ui/CreatedAt";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import Message from "../ui/Message";
import { useNavigate } from "react-router-dom";
import ModifyButtons from "../ui/ModifyButtons";
import BlogPostStatsBar from "./BlogPostStatsBar";

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
        <ModifyButtons
          token={token}
          userId={post?.user_id}
          onClickDelete={handleDeletePost}
          loadingDelete={loadingDelete}
        />
      </div>
      {errorDelete && <Message type="error" text={errorDelete} />}
      {successDelete && <Message text="Successfully deleted post!" />}
      <h2 className="my-4">{post.title}</h2>
      <div
        className="mb-4 mt-6 text-sm"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(post.description),
        }}
      />

      <BlogPostStatsBar post={post} />
    </div>
  );
}
