import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import InlineLoader from "../components/layout/InlineLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faCommentDots,
  faUserGroup,
  faClockFour,
} from "@fortawesome/free-solid-svg-icons";
import { formatRelativeTime } from "../helper-functions/timeFormat";

export default function BlogPost() {
  const { id } = useParams();
  const {
    data: postData,
    loading,
    error,
  } = useFetch(`http://localhost:8080/posts/${id}`);

  if (loading) return <InlineLoader />;
  if (error) return <p>Error: {error}</p>;
  const post = postData.post;

  return (
    <div className="container mx-auto px-6 md:px-8 ">
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

      <h2 className="text-gray-900 hover:text-orange-600 transition-colors duration-200 ease-in-out mb-2">
        {post.title}
      </h2>

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
