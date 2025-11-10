import MainLayout from "../components/layout/MainLayout";
import BlogPosts from "../components/blogs/BlogPosts";
import Banner from "../components/ui/Banner";
import Groups from "../components/groups/Groups";

const apiUrl = import.meta.env.VITE_API_URL;
export default function LatestPosts() {
  return (
    <MainLayout>
      <>
        <Banner text="НАЈНОВИ ОБЈАВИ..." />

        <BlogPosts
          group="general"
          url={`${apiUrl}/posts`}
          enableAddPost={false}
        />
      </>
      <Groups url={`${apiUrl}/groups`} />
    </MainLayout>
  );
}
