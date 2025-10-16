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
import CreatedAt from "../ui/CreatedAt";

export default function BlogPostCard({ post }) {
  return (
    <li>
      <div className="bg-orange-100/10 border border-gray-200 rounded-xl p-5 hover:bg-orange-200/10 hover:shadow-sm transition-all duration-200 flex flex-col items-start relative">
        <Link
          className="absolute top-0 left-0 w-full h-full z-0"
          to={`/posts/${post.id}`}
        ></Link>
        <div className="flex items-center gap-2">
          {!post.group_name ? (
            <span className="text-sm text-gray-600 mb-1 inline-flex gap-1 items-center">
              <FontAwesomeIcon icon={faUserGroup} />
              <span>/general</span>
            </span>
          ) : (
            <Link
              to={`/groups/${post.group_name}`}
              className="text-sm text-orange-600 hover:underline mb-1 inline-flex gap-1 items-center relative z-10"
            >
              <FontAwesomeIcon icon={faUserGroup} />
              <span>/{post.group_name}</span>
            </Link>
          )}
          <CreatedAt time={post.created_at} />
        </div>

        <Link to={`/posts/${post.id}`}>
          <h3 className="text-gray-900 hover:text-orange-600 transition-colors duration-200 ease-in-out mb-2 relative z-10">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-700 mb-4 ">{post.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 items-center ">
          <span className="flex items-center gap-1 relative z-10">
            <FontAwesomeIcon icon={faArrowUp} />
            {post.upvotes}
          </span>
          <span className="flex items-center gap-1 relative z-10">
            <FontAwesomeIcon icon={faArrowDown} />
            {post.downvotes}
          </span>
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faCommentDots} />
            {post.comment_count} comments
          </span>
        </div>
      </div>
    </li>
  );
}
