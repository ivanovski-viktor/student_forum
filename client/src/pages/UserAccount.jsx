import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import InlineLoader from "../components/layout/InlineLoader";
import { formatDateTime } from "../helper-functions/timeFormat";
import ProfileImage from "../components/users/ProfileImage";
import { useFetch } from "../hooks/useFetch";
import NotFound from "./NotFound";
import { usePageLoading } from "../context/PageLoadingContext";
import MainLayout from "../components/layout/MainLayout";
import Groups from "../components/groups/Groups";

const apiUrl = import.meta.env.VITE_API_URL;

export default function UserAccount() {
  const { setPageLoading } = usePageLoading();
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const { data: currentUserData, error: currentUserError } = useFetch(
    token ? `${apiUrl}/users/me` : null,
    {
      headers: { Authorization: token },
    }
  );

  const { data: userData, loading, error } = useFetch(`${apiUrl}/users/${id}`);

  useEffect(() => {
    if (userData !== false) {
      setPageLoading(false);
    }
    if (!currentUserData || !id) return;
    if (Number(id) === currentUserData.user?.id) {
      navigate("/users/me", { replace: true });
    }
  }, [userData, id, navigate]);

  // Handle loading + error
  if (loading) return <InlineLoader />;
  if (error) return <NotFound text="Корисникот не постои!" />;
  if (currentUserError) console.warn("Auth check failed:", currentUserError);

  const { profile_image_url, username, email, created_at } = userData.user;

  return (
    <MainLayout>
      <div className="">
        <div className="bg-box p-5 rounded-xl">
          <div className="flex items-start justify-between">
            <h2 className="mb-6">Кориснички профил</h2>
          </div>
          <div className="flex flex-col items-start justify-center sm:grid sm:grid-cols-6 ">
            <div className="sm:col-span-2 max-sm:w-[280px] max-w-full m-auto">
              <ProfileImage
                key={profile_image_url}
                image_url={profile_image_url}
                uploadImage={true}
              />
            </div>
            <div className="w-full sm:col-span-4 flex flex-col items-start gap-2 justify-between h-full  max-sm:mt-8 sm:pl-5">
              {username && (
                <div className=" flex flex-col gap-0.5 py-2 flex-1 bg-box w-full rounded-md px-3">
                  <h5 className="font-bold">Корисничко име:</h5>{" "}
                  <p>{username}</p>
                </div>
              )}
              {created_at && (
                <div className=" flex flex-col gap-0.5 py-2 flex-1 bg-box w-full rounded-md px-3">
                  <h5 className="font-bold">Член од:</h5>
                  <p className="capitalize">{formatDateTime(created_at)}</p>
                </div>
              )}
              {email && (
                <div className=" flex flex-col gap-0.5 py-2 flex-1 bg-box w-full rounded-md px-3">
                  <h5 className="font-bold">Е-пошта:</h5>
                  <p>{email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Groups url={`${apiUrl}/groups`} />
    </MainLayout>
  );
}
