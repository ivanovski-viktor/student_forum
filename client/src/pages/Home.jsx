import BlogPosts from "../components/ui/BlogPosts";

export default function Home() {
  const token = localStorage.getItem("token");
  return (
    <>
      <div>Token: {token}</div>
      <BlogPosts url="http://localhost:8080/posts" />
    </>
  );
}
