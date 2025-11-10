import { useEffect } from "react";
import InlineLoader from "../components/layout/InlineLoader";
import { formatDateTime } from "../helper-functions/timeFormat";
import LinkUnderline from "../components/ui/LinkUnderline";

import logout from "../helper-functions/logout";

import ProfileImage from "../components/users/ProfileImage";
import { useFetch } from "../hooks/useFetch";
import NotFound from "./NotFound";

import { LogOut } from "lucide-react";
import { usePageLoading } from "../context/PageLoadingContext";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthUserContext";
import MainLayout from "../components/layout/MainLayout";
import Groups from "../components/groups/Groups";

const apiUrl = import.meta.env.VITE_API_URL;

export default function MyAccount() {
  const { pageLoading, setPageLoading } = usePageLoading();
  const { authUser, isAuthenticated, checkAuth } = useAuthUser();
  const navigate = useNavigate();

  // Run checkAuth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && pageLoading) {
      setPageLoading(false);
    }
    if (authUser === null && !isAuthenticated) {
      setPageLoading(false);
      navigate("/login", { replace: true });
    }
  }, [authUser, isAuthenticated, navigate, setPageLoading, pageLoading]);

  if (!authUser || !isAuthenticated) return null;

  const { profile_image_url, id, username, email, created_at } = authUser.user;
  return (
    <MainLayout>
      <div className="">
        <div className="bg-box p-5 rounded-xl">
          <div className="flex items-start justify-between">
            <h2 className="mb-6">Мој Профил</h2>
            <div className="flex items-center justify-center">
              <button
                onClick={logout}
                className="text-primary transition-colors duration-200 ease-in-out shrink-0 no-underline underline-offset-2 hover:underline mx-auto cursor-pointer group hover:text-error"
              >
                <LogOut size={18} />
              </button>
            </div>
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
              <div className=" flex flex-col gap-0.5 py-2 flex-1 bg-box w-full rounded-md px-3">
                <h5 className="font-bold">Лозинка:</h5>{" "}
                <p className="leading-0">***********</p>
                <div className="text-xs flex-1">
                  <LinkUnderline
                    link="./change-password"
                    text="Промени лозинка"
                    colorClass="text-error"
                    bgClass="bg-error"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Groups url={`${apiUrl}/groups`} />
    </MainLayout>
  );
}
