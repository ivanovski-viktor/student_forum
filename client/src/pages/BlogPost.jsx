import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import InlineLoader from "../components/layout/InlineLoader";
import MainLayout from "../components/layout/MainLayout";
import CommentSection from "../components/blogs/CommentSection";
import NotFound from "./NotFound";
import BlogPostMain from "../components/blogs/BlogPostMain";

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
  if (postError) return <NotFound text="Објавата која ја бараш не постои" />;
  if (commentsError) return <NotFound text={commentsError} largeText="" />;

  const post = postData?.post;
  const comments = commentsData?.comments || [];

  return (
    <MainLayout>
      <div>
        <BlogPostMain post={post} />
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
