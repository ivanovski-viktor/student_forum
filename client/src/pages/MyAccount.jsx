import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InlineLoader from "../components/layout/InlineLoader";
import UploadProfileImage from "../components/ui/UploadProfileImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

import logout from "../helper-functions/logout";

import userPlaceholder from "../assets/user-placeholder.png";

export default function MyAccount() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null); // to store the response data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if no token
  useEffect(() => {
    if (token == null) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch user data
  useEffect(() => {
    if (!token) return; // Don't run fetch if there's no token

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid/expired, redirect to login
            navigate("/login");
          } else {
            throw new Error(`Error ${response.status}`);
          }
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (loading) return <InlineLoader />;

  if (error) return <div>Error: {error}</div>;

  const { profile_image_url, id, username, email, created_at } = userData.user;

  return (
    <div className="container mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className=" max-w-2xl mx-auto p-6 sm:p-10 border shadow-2xl shadow-gray-200 border-orange-300 bg-white rounded-xl ">
        <h2 className="mb-6 text-center text-2xl font-bold ">My Profile</h2>
        <div className="sm:grid sm:grid-cols-4">
          <div className="sm:col-span-1 max-sm:w-40 max-sm:mx-auto">
            {profile_image_url ? (
              <div className="relative">
                <UploadProfileImage />
                <img
                  className="rounded-xl w-full aspect-[1/1.25] object-cover"
                  src={profile_image_url}
                  alt="placeholder image"
                />
              </div>
            ) : (
              <div className="relative">
                <UploadProfileImage />
                <img
                  className=" pt-10 bg-orange-600 rounded-xl aspect-[1/1.25] object-cover"
                  src={userPlaceholder}
                  alt="placeholder image"
                />
              </div>
            )}
            <img src="" alt="" />
          </div>
          <div className="sm:col-span-3"></div>
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

      {/* <div className="">{JSON.stringify(userData.user)}test</div> */}
    </div>
  );
}
