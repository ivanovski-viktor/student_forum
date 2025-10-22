import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";

import AddBlogPost from "./AddBlogPostModal";
import LogInCta from "./LogInCta";
import { useState } from "react";

import BlogPostCard from "./BlogPostCard";
import { useAuthUser } from "../../context/AuthUserContext";

export default function BlogPosts({ group, url }) {
  const { authUser, isAuthenticated } = useAuthUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: postsData, loading, error } = useFetch(url);

  if (loading) return <InlineLoader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {isAuthenticated && (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2>Објави во {group}</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn--primary inline-flex items-center gap-1"
            >
              Објави
            </button>
          </div>

          <AddBlogPost
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
      {!isAuthenticated && <LogInCta text="Најави се за да објавиш нешто..." />}
      <ul className="space-y-4">
        {postsData.posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}
