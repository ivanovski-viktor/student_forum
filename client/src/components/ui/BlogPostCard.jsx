import { formatRelativeTime } from "../../helper-functions/timeFormat";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faCommentDots,
  faUserGroup,
  faClockFour,
} from "@fortawesome/free-solid-svg-icons";

export default function BlogPostCard({ post }) {
  return (
    <li
      key={post.id}
      className="bg-white border-2 border-dashed border-orange-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow duration-200 flex flex-col items-start"
    >
      <div className="flex items-center gap-2">
        {!post.group_name ? (
          <span className="text-sm text-gray-600 mb-1 inline-flex gap-1 items-center">
            <FontAwesomeIcon icon={faUserGroup} />
            <span>/general</span>
          </span>
        ) : (
          <Link
            to={`/groups/${post.group_name}`}
            className="text-sm text-orange-600 hover:underline mb-1 inline-flex gap-1 items-center"
          >
            <FontAwesomeIcon icon={faUserGroup} />
            <span>/{post.group_name}</span>
          </Link>
        )}
        <span className="flex items-center gap-1 text-xs text-gray-400 border-l border-gray-300 pl-2">
          <FontAwesomeIcon icon={faClockFour} />
          {formatRelativeTime(post.created_at)}
        </span>
      </div>

      <Link to={`/posts/${post.id}`}>
        <h2 className="text-xl font-semibold text-gray-900 hover:text-orange-600 transition-colors duration-200 ease-in-out mb-2">
          {post.title}
        </h2>
      </Link>

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
    </li>
  );
}
