import { useEffect, useState } from "react";
import {} from "react-router-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import InlineLoader from "../components/layout/InlineLoader";
import { formatDateTime } from "../helper-functions/timeFormat";
import ProfileImage from "../components/users/ProfileImage";
import { useFetch } from "../hooks/useFetch";
import NotFound from "./NotFound";

const apiUrl = import.meta.env.VITE_API_URL;

export default function UserAccount() {
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
    if (!currentUserData || !id) return;
    if (Number(id) === currentUserData.user?.id) {
      navigate("/users/me");
    }
  }, [currentUserData, id, navigate]);

  // Handle loading + error
  if (loading) return <InlineLoader />;
  if (error) return <NotFound text="Корисникот не постои!" />;
  if (currentUserError) console.warn("Auth check failed:", currentUserError);

  const { profile_image_url, username, email, created_at } = userData.user;

  return (
    <div className="container mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className=" max-w-2xl mx-auto p-6 sm:p-10 border shadow-2xl shadow-gray-300 border-gray-200 bg-white rounded-xl ">
        <div className="flex flex-col items-center justify-center sm:grid sm:grid-cols-6 ">
          <div className="sm:col-span-2 max-sm:w-[280px] max-w-full">
            <ProfileImage image_url={profile_image_url} />
          </div>
          <div className="sm:col-span-4 flex flex-col items-start justify-center sm:pl-10 gap-4 max-sm:mt-8">
            {created_at && (
              <div className=" flex items-center gap-2">
                <h5 className="!font-bold">Член од:</h5>
                <p className="capitalize">{formatDateTime(created_at)}</p>
              </div>
            )}
            {username && (
              <div className=" flex items-center gap-2">
                <h5 className="!font-bold">Корисничко име:</h5>{" "}
                <p>{username}</p>
              </div>
            )}

            {email && (
              <div className=" flex items-center gap-2">
                <h5 className="!font-bold">Е-пошта:</h5>
                <p>{email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
