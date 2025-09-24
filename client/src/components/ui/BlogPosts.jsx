import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import BlogPostCard from "./BlogPostCard";

export default function BlogPosts({ url }) {
  const { data: postsData, loading, error } = useFetch(url);

  if (loading) return <InlineLoader />;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul className="space-y-4 p-5">
      {postsData.posts.map((post) => (
        <BlogPostCard post={post} />
      ))}
    </ul>
  );
}
