import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import InlineLoader from "../components/layout/InlineLoader";
import MainLayout from "../components/layout/MainLayout";
import BlogPosts from "../components/blogs/BlogPosts";
import NotFound from "./NotFound";
import { Users } from "lucide-react";
import Button from "../components/ui/Button";
import { useAuthUser } from "../context/AuthUserContext";
import GroupUsers from "../components/groups/GroupUsers";
import Banner from "../components/ui/Banner";
import { usePostRequest } from "../hooks/usePostRequest";
import { useEffect, useState } from "react";
import { useDeleteRequest } from "../hooks/useDeleteRequest";
import ModifyButtons from "../components/ui/ModifyButtons";
import Message from "../components/ui/Message";

const apiUrl = import.meta.env.VITE_API_URL;
export default function Group() {
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
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

  // Delete group
  const {
    exec: handleDelete,
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useDeleteRequest(groupUrl, token);

  useEffect(() => {
    if (successDelete) {
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [successDelete, navigate]);

  if (loadingGroupData) return <InlineLoader />;
  if (groupError) return <NotFound />;
  const group = groupData?.group;
  const isCreator = group?.creator_id === authUser?.user?.id;

  return (
    <MainLayout key={refreshKey}>
      <>
        <Banner img_url={group.group_cover_url} text={group.description} />
        <div className="pt-5 px-2 md:pl-6  relative flex items-center gap-4 justify-between flex-wrap-reverse">
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
            <div>
              <h5>g/{group.name}</h5>
              {errorDelete && <Message type="error" text={errorDelete} />}
              {successDelete && <Message text="Successfully deleted group!" />}
            </div>
            <ModifyButtons
              token={token}
              userId={group?.creator_id}
              onClickDelete={handleDelete}
              loadingDelete={loadingDelete}
            />
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
        creatorId={group?.creator_id}
      />
    </MainLayout>
  );
}
