import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InlineLoader from "../components/layout/InlineLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { formatDateTime } from "../helper-functions/timeFormat";
import LinkUnderline from "../components/ui/LinkUnderline";

import logout from "../helper-functions/logout";

import ProfileImage from "../components/users/ProfileImage";
import { useFetch } from "../hooks/useFetch";
import NotFound from "./NotFound";

const apiUrl = import.meta.env.VITE_API_URL;

export default function MyAccount() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect if no token
  useEffect(() => {
    if (token == null) {
      navigate("/login");
    }
  }, [token, navigate]);

  const {
    data: userData,
    loading,
    error,
  } = useFetch(`${apiUrl}/users/me`, {
    headers: { "Content-Type": "application/json", Authorization: token },
  });

  if (loading) return <InlineLoader />;

  if (error) return <NotFound text={error} largeText="" />;

  const { profile_image_url, id, username, email, created_at } = userData.user;

  return (
    <div className="container mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className=" max-w-2xl mx-auto p-6 sm:p-10 border shadow-2xl shadow-gray-300 border-orange-100 bg-white rounded-xl ">
        <h2 className="mb-6 text-center">Мој Профил</h2>
        <div className="flex flex-col items-center justify-center sm:grid sm:grid-cols-6 ">
          <div className="sm:col-span-2 max-sm:w-[280px] max-w-full">
            <ProfileImage image_url={profile_image_url} uploadImage={true} />
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
            <div className=" flex items-center gap-2">
              <h5 className="!font-bold">Лозинка:</h5>{" "}
              <p className="leading-0">***********</p>
            </div>
            <div className="text-xs -mt-3">
              <LinkUnderline
                link="./change-password"
                text="Промени лозинка"
                colorClass="text-red-500"
                bgClass="bg-red-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={logout}
            className="text-orange-600 no-underline underline-offset-2 hover:underline mx-auto cursor-pointer group"
          >
            Logout
            <FontAwesomeIcon
              className="opacity-0 max-w-0 w-4 transition-all duration-200 ease-in-out group-hover:max-w-3 group-hover:opacity-100 group-hover:ml-1"
              icon={faArrowRightLong}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
