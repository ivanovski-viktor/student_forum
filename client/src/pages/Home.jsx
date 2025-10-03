import BlogPosts from "../components/ui/BlogPosts";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Home() {
  const token = localStorage.getItem("token");
  return (
    <>
      <div>Token: {token}</div>
      <BlogPosts url={`${apiUrl}/posts`} />
    </>
  );
}
