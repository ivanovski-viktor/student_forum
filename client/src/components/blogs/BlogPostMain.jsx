import {
  RiArrowUpFill,
  RiArrowDownFill,
  RiMessage2Line,
  RiGroup2Fill,
} from "react-icons/ri";

import CreatedAt from "../ui/CreatedAt";

export default function BlogPostMain({ post }) {
  return (
    <div>
      <div>
        <div className="flex items-center gap-2">
          {!post.group_name ? (
            <span className="text-sm text-gray-600 mb-1 inline-flex gap-1 items-center">
              <RiGroup2Fill className="text-lg" />
              <span>/general</span>
            </span>
          ) : (
            <span className="text-sm text-gray-600 mb-1 inline-flex gap-1 items-center">
              <RiGroup2Fill className="text-lg" />

              <span>/{post.group_name}</span>
            </span>
          )}

          <CreatedAt time={post.created_at} />
        </div>
        <div></div>
      </div>
      <h2 className="text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 text-sm">{post.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 items-center">
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
