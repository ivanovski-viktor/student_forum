import BlogPosts from "../components/blogs/BlogPosts";
import MainLayout from "../components/layout/MainLayout";
import Groups from "../components/groups/Groups";
import Banner from "../components/ui/Banner";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Home() {
  return (
    <MainLayout>
      <>
        <Banner text="Од студент, за студенти." />
        <BlogPosts group="g/general" url={`${apiUrl}/posts`} />
      </>

      <Groups url={`${apiUrl}/groups`} />
    </MainLayout>
  );
}
