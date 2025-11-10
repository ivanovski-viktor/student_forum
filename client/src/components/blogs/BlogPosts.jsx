import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import AddBlogPostModal from "./AddBlogPostModal";
import LogInCta from "../ui/LogInCta";
import { useEffect, useState } from "react";
import BlogPostCard from "./BlogPostCard";
import { useAuthUser } from "../../context/AuthUserContext";
import { useLocation } from "react-router-dom";
import { usePageLoading } from "../../context/PageLoadingContext";

export default function BlogPosts({
  group,
  url,
  groupMember,
  enableAddPost = true,
}) {
  const { pageLoading, setPageLoading } = usePageLoading();
  const { authUser, isAuthenticated, checkAuth } = useAuthUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogsPage, setBlogsPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const [totalPages, setTotalPages] = useState(1); // default 1

  const urlPaginated = `${url}?page=${blogsPage}`;
  const { data, loading, error } = useFetch(urlPaginated);

  // Append new posts when data changes
  useEffect(() => {
    if (data?.posts) {
      setPosts((prev) => {
        const newPosts = data.posts.filter(
          (p) => !prev.some((existing) => existing.id === p.id)
        );
        return [...prev, ...newPosts];
      });

      if (data.total_pages) setTotalPages(data.total_pages);
    }
  }, [data?.posts, data?.total_pages]);

  useEffect(() => {
    if (!loading) setPageLoading(false);
  }, [loading]);

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
      {isAuthenticated && enableAddPost === true && (
        <>
          <div className="flex items-center justify-between my-5">
            {groupMember || location.pathname === "/" ? (
              <h2 className="h3">Објави во {group}</h2>
            ) : (
              <h2 className="h3">Придружи се за да објавиш во {group}</h2>
            )}

            {(groupMember || location.pathname === "/") && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn--small inline-flex items-center gap-1 m-0"
              >
                Објави
              </button>
            )}
          </div>

          {(groupMember || location.pathname === "/") && (
            <AddBlogPostModal
              url={url}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </>
      )}

      {!isAuthenticated && enableAddPost === true && (
        <LogInCta text="Најави се за да објавиш нешто..." />
      )}

      <ul className="space-y-4 my-4">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </ul>

      {loading && <InlineLoader />}
    </div>
  );
}
