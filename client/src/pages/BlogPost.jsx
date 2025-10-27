import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import InlineLoader from "../components/layout/InlineLoader";
import MainLayout from "../components/layout/MainLayout";
// import CommentSection from "../components/blogs/CommentSection";
import CommentOnPost from "../components/blogs/CommentOnPost";
import NotFound from "./NotFound";
import BlogPostMain from "../components/blogs/BlogPostMain";
import Comment from "../components/blogs/Comment";
import Loader from "../components/layout/Loader";
import { usePageLoading } from "../context/PageLoadingContext";
import { useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

// TODO Make api return user data with username user image also

export default function BlogPost() {
  const { setPageLoading } = usePageLoading();
  const { id } = useParams();
  const postUrl = `${apiUrl}/posts/${id}`;

  // Fetch post data
  const {
    data: postData,
    loading: loadingPostData,
    error: postError,
    refetch: refetchPost,
  } = useFetch(postUrl);

  // Fetch comments data with refetch
  const {
    data: commentsData,
    loading: loadingCommentsData,
    error: commentsError,
    refetch: refetchComments,
  } = useFetch(`${postUrl}/comments`);

  useEffect(() => {
    if (postData && commentsData) {
      setPageLoading(false);
    }
  }, [postData, commentsData]);

  function refetchData() {
    refetchPost();
    refetchComments();
  }

  if (loadingPostData || loadingCommentsData) return <Loader loading={true} />;
  if (postError) return <NotFound text="Објавата која ја бараш не постои" />;
  if (commentsError) return <NotFound text={commentsError} largeText="" />;

  const post = postData?.post;
  const comments = commentsData?.comments || [];

  return (
    <MainLayout>
      <div>
        <BlogPostMain postUrl={postUrl} post={post} />

        <div className="text-sm space-y-3">
          <h5 className="mt-5 font-normal">Comments:</h5>

          {comments && <CommentOnPost onCommentPosted={refetchData} />}
          {loadingCommentsData && <InlineLoader />}

          {comments &&
            [...comments]
              .reverse()
              .map((comment) => (
                <Comment
                  refetchPostData={refetchData}
                  key={comment.id}
                  comment={comment}
                />
              ))}
        </div>
      </div>
    </MainLayout>
  );
}
