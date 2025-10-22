import { useAuthUser } from "../context/AuthUserContext";

import BlogPosts from "../components/blogs/BlogPosts";
import MainLayout from "../components/layout/MainLayout";
import Groups from "../components/groups/Groups";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Home() {
  return (
    <MainLayout>
      <BlogPosts group="/general" url={`${apiUrl}/posts`} />

      <Groups url={`${apiUrl}/groups`} />
    </MainLayout>
  );
}
