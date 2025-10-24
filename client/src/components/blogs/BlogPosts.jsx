import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import AddBlogPostModal from "./AddBlogPostModal";
import LogInCta from "../ui/LogInCta";
import { useEffect, useState } from "react";
import BlogPostCard from "./BlogPostCard";
import { useAuthUser } from "../../context/AuthUserContext";

export default function BlogPosts({ group, url }) {
  const { authUser, isAuthenticated } = useAuthUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogsPage, setBlogsPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // default 1

  const urlPaginated = `${url}?page=${blogsPage}`;
  const { data, loading, error } = useFetch(urlPaginated);

  // Append new posts when data changes
  useEffect(() => {
    if (data?.posts) {
      setPosts((prev) => [...prev, ...data.posts]);
      if (data.total_pages) setTotalPages(data.total_pages);
    }
  }, [data]);

  // Infinite scroll
  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight =
        document.documentElement.scrollTop + window.innerHeight;

      if (currentHeight + 1 >= scrollHeight && blogsPage < totalPages) {
        setBlogsPage((prev) => prev + 1);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blogsPage, totalPages]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {isAuthenticated && (
        <>
          <div className="flex items-center justify-between my-5">
            <h2 className="h3">Објави во {group}</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn--primary inline-flex items-center gap-1 m-0"
            >
              Објави
            </button>
          </div>

          <AddBlogPostModal
            url={url}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}

      {!isAuthenticated && <LogInCta text="Најави се за да објавиш нешто..." />}

      <ul className="space-y-4">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </ul>

      {loading && <InlineLoader />}
    </div>
  );
}
