import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useRevalidator,
} from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import InlineLoader from "../components/layout/InlineLoader";
import MainLayout from "../components/layout/MainLayout";
import BlogPosts from "../components/blogs/BlogPosts";
import NotFound from "./NotFound";
import { Image, Users } from "lucide-react";
import Button from "../components/ui/Button";
import { useAuthUser } from "../context/AuthUserContext";
import GroupUsers from "../components/groups/GroupUsers";
import Banner from "../components/ui/Banner";
import { usePostRequest } from "../hooks/usePostRequest";
import { useState } from "react";
import { useDeleteRequest } from "../hooks/useDeleteRequest";
import { usePageLoading } from "../context/PageLoadingContext";

const apiUrl = import.meta.env.VITE_API_URL;
export default function Group() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { name } = useParams();
  const token = localStorage.getItem("token");
  const { authUser, isAuthenticated, checkAuth } = useAuthUser();
  const groupUrl = `${apiUrl}/groups/${name}`;

  const [groupMember, setGroupMember] = useState(false);

  const {
    data: groupData,
    loading: loadingGroupData,
    error: groupError,
  } = useFetch(groupUrl);

  const { exec: joinGroup } = usePostRequest(`${groupUrl}/join`, token);
  const { exec: leaveGroup } = useDeleteRequest(`${groupUrl}/leave`, token);

  async function handleGroupToggle() {
    await checkAuth();
    if (!isAuthenticated) return;

    if (groupMember) {
      await leaveGroup();
      setGroupMember(false);
    } else {
      await joinGroup();
    }

    setRefreshKey((prev) => prev + 1);
  }

  if (loadingGroupData) return <InlineLoader />;
  if (groupError) return <NotFound />;
  const group = groupData?.group;
  const isCreator = group?.creator_id === authUser?.user?.id;

  return (
    <MainLayout key={refreshKey}>
      <>
        <Banner img_url={group.group_cover_url} text={group.description} />
        <div className="pt-5 pl-6 relative flex items-center gap-4 justify-between">
          <div className="relative flex items-center gap-4">
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
          {isAuthenticated && !isCreator ? (
            groupMember ? (
              <Button
                onClick={handleGroupToggle}
                buttonType="button"
                text="Напушти"
                extraClass="btn--secondary disabled"
              />
            ) : (
              <Button
                onClick={handleGroupToggle}
                buttonType="button"
                text="Придружи се"
                extraClass="btn--secondary"
              />
            )
          ) : !isAuthenticated ? (
            <Button link="/login" text="Придружи се" />
          ) : null}
        </div>

        <BlogPosts
          group="групата"
          url={`${groupUrl}/posts`}
          groupMember={groupMember}
        />
      </>
      <GroupUsers
        url={`${groupUrl}/users`}
        authUser={authUser}
        setGroupMember={setGroupMember}
      />
    </MainLayout>
  );
}
