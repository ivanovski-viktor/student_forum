import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faCommentDots,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import CreatedAt from "../ui/CreatedAt";

export default function BlogPostMain({ post }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {!post.group_name ? (
          <span className="text-sm text-gray-600 mb-1 inline-flex gap-1 items-center">
            <FontAwesomeIcon icon={faUserGroup} />
            <span>/general</span>
          </span>
        ) : (
          <span className="text-sm text-gray-600 mb-1 inline-flex gap-1 items-center">
            <FontAwesomeIcon icon={faUserGroup} />
            <span>/{post.group_name}</span>
          </span>
        )}

        <CreatedAt time={post.created_at} />
      </div>

      <h2 className="text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 text-sm">{post.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 items-center">
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faArrowUp} />
          {post.upvotes}
        </span>
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faArrowDown} />
          {post.downvotes}
        </span>
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faCommentDots} />
          {post.comment_count} comments
        </span>
      </div>
    </div>
  );
}
