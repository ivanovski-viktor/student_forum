import { useEffect, useState } from "react";
import {} from "react-router-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import InlineLoader from "../components/layout/InlineLoader";
import UploadProfileImage from "../components/ui/UploadProfileImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { formatDateTime } from "../helper-functions/timeFormat";
import LinkUnderline from "../components/ui/LinkUnderline";

import logout from "../helper-functions/logout";

import ProfileImage from "../components/users/ProfileImage";

const apiUrl = import.meta.env.VITE_API_URL;

export default function MyAccount() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          navigate("/404");
          return;
        }

        const data = await response.json();

        if (data && Number(id) === data.user.id) navigate("/users/me");
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchData();
  }, [token, navigate, id]);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          navigate("/404");
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
  }, [navigate]);

  if (loading) return <InlineLoader />;

  if (error) return <div>Error: {error}</div>;

  const { profile_image_url, username, email, created_at } = userData.user;

  return (
    <div className="container mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className=" max-w-2xl mx-auto p-6 sm:p-10 border shadow-2xl shadow-gray-300 border-orange-100 bg-white rounded-xl ">
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
