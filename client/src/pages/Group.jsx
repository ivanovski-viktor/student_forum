import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import InlineLoader from "../components/layout/InlineLoader";
import MainLayout from "../components/layout/MainLayout";
import BlogPosts from "../components/blogs/BlogPosts";

const apiUrl = import.meta.env.VITE_API_URL;
export default function Group() {
  const { name } = useParams();
  const groupUrl = `${apiUrl}/groups/${name}`;

  const {
    data: groupData,
    loading: loadingGroupData,
    error: groupError,
  } = useFetch(groupUrl);

  if (loadingGroupData) return <InlineLoader />;
  if (groupError) return <p>Error: {groupError}</p>;
  const group = groupData?.group;
  if (!group) return <p>No Group found.</p>;

  return (
    <MainLayout>
      <div>
        <div>{JSON.stringify(group)}</div>
        <BlogPosts url={`${groupUrl}/posts`} />
      </div>
      <div>test</div>
    </MainLayout>
  );
}
