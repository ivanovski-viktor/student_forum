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
import MainLayout from "../components/layout/MainLayout";
import CommentSection from "../components/blogs/CommentSection";
import CreatedAt from "../components/ui/CreatedAt";

const apiUrl = import.meta.env.VITE_API_URL;

export default function BlogPost() {
  const { id } = useParams();

  const {
    data: postData,
    loading: loadingPostData,
    error: postError,
  } = useFetch(`${apiUrl}/posts/${id}`);

  const {
    data: commentsData,
    loading: loadingCommentsData,
    error: commentsError,
  } = useFetch(`${apiUrl}/posts/${id}/comments`);

  if (loadingPostData) return <InlineLoader />;
  if (postError) return <p>Error: {postError}</p>;
  if (commentsError) return <p>Error: {commentsError}</p>;

  const post = postData?.post;
  const comments = commentsData?.comments || [];
  if (!post) return <p>No post found.</p>;

  return (
    <MainLayout>
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
        <div className="text-sm space-y-2">
          <h5 className="mt-5 !font-normal">Comments:</h5>

          {loadingCommentsData && <InlineLoader />}
          {comments.length < 1 && (
            <div className="text-gray-600">Напиши го првиот коментар...</div>
          )}
          {comments && <CommentSection comments={comments} />}
        </div>
      </div>
    </MainLayout>
  );
}
