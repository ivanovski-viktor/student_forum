import DOMPurify from "dompurify";

import CreatedAt from "../ui/CreatedAt";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import Message from "../ui/Message";
import { useNavigate } from "react-router-dom";
import ModifyButtons from "../ui/ModifyButtons";
import BlogPostStatsBar from "./BlogPostStatsBar";
import { Users } from "lucide-react";
import BlogPostMedia from "./BlogPostMedia";
import { useEffect, useState } from "react";
import BlogAuthor from "./BlogAuthor";

export default function BlogPostMain({ post, postUrl }) {
  const [showBlogAuthor, setShowBlogAuthor] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Set showBlogAuthor if on blog post page
  useEffect(() => {
    if (location.pathname.includes("/posts/")) {
      setShowBlogAuthor(true);
    }
  }, [location.pathname]);

  const {
    exec: handleDeletePost,
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useDeleteRequest(postUrl, token);

  if (successDelete) {
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1500);
  }

  return (
    <div className="blog-post">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!post.group_name ? (
            <span className="text-sm text-foreground-light mb-1 inline-flex gap-1 items-center">
              <div className="text-lg">
                <Users size={20} />
              </div>
              <span>g/general</span>
            </span>
          ) : (
            <span className="text-sm text-foreground-light mb-1 inline-flex gap-1 items-center">
              <div className="text-lg">
                <Users size={20} />
              </div>
              <span>g/{post.group_name}</span>
            </span>
          )}

          <CreatedAt time={post.created_at} />
        </div>
        <ModifyButtons
          post={post}
          url={postUrl}
          userId={post?.user_id}
          onClickDelete={handleDeletePost}
          loadingDelete={loadingDelete}
        />
      </div>
      {showBlogAuthor && (
        <BlogAuthor key={post.user_id} authorId={post.user_id} />
      )}

      {errorDelete && <Message type="error" text={errorDelete} />}
      {successDelete && <Message text="Successfully deleted post!" />}
      <h2 className="my-4">{post.title}</h2>
      <div
        className="mb-4 mt-6 text-sm"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(post.description),
        }}
      />
      <BlogPostMedia media={post?.media} />
      <BlogPostStatsBar post={post} />
    </div>
  );
}
