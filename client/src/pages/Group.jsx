import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import InlineLoader from "../components/layout/InlineLoader";
import MainLayout from "../components/layout/MainLayout";
import BlogPosts from "../components/blogs/BlogPosts";
import NotFound from "./NotFound";

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
  if (groupError) return <NotFound />;
  const group = groupData?.group;

  return (
    <MainLayout>
      <div>
        <div>{JSON.stringify(group)}</div>
        <BlogPosts group={group.name} url={`${groupUrl}/posts`} />
      </div>
      <div>test</div>
    </MainLayout>
  );
}
