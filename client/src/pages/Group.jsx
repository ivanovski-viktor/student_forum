import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import InlineLoader from "../components/layout/InlineLoader";
import MainLayout from "../components/layout/MainLayout";
import BlogPosts from "../components/blogs/BlogPosts";
import NotFound from "./NotFound";
import { Image, Users } from "lucide-react";

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
      <>
        <div>
          <div className="p-8 pb-12 border border-stroke rounded-xl shadow-sm relative min-h-36 overflow-hidden">
            {group.group_cover_url ? (
              <img
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={group?.group_cover_url}
                alt="Group cover image."
              />
            ) : (
              <Image className="absolute top-0 left-0 w-full h-full object-cover" />
            )}

            <div className="absolute top-0 left-0 w-full h-full bg-foreground/40"></div>
            <p className="relative font-semibold text-balance text-background text-lg">
              {group.description ? group.description : "ГРУПАТА НЕМА ОПИС..."}
            </p>
          </div>
          <div className="pt-5 pl-6 relative flex items-center gap-4">
            {group.group_image_url ? (
              <img
                className="group-img group-img--large"
                src={group.group_image_url}
                width={50}
                height={50}
                alt="Group profile image"
              />
            ) : (
              <Users size={50} className="group-img group-img--large" />
            )}
            <h5>g/{group.name}</h5>
          </div>
        </div>

        <BlogPosts group="групата" url={`${groupUrl}/posts`} />
      </>
      <div>test</div>
    </MainLayout>
  );
}
