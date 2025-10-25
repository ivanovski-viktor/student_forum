import { useAuthUser } from "../context/AuthUserContext";

import BlogPosts from "../components/blogs/BlogPosts";
import MainLayout from "../components/layout/MainLayout";
import Groups from "../components/groups/Groups";
import Banner from "../components/ui/Banner";
import bannerImage from "../assets/sf-logo.webp";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Home() {
  return (
    <MainLayout>
      <>
        <Banner
          img_url={bannerImage}
          text="Created by a STUDENT. For STUDENTS."
        />
        <BlogPosts group="g/general" url={`${apiUrl}/posts`} />
      </>

      <Groups url={`${apiUrl}/groups`} />
    </MainLayout>
  );
}
