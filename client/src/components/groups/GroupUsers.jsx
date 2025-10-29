import { Link, useLocation } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import { User, Users } from "lucide-react";
import LinkUnderline from "../ui/LinkUnderline";
import { useEffect } from "react";

export default function GroupUsers({ url, authUser, setGroupMember }) {
  const location = useLocation();
  const { data: data, loading, error } = useFetch(url);

  const users = data?.groupUsers || [];

  useEffect(() => {
    if (!authUser?.user?.id) return;
    const isMember = users.some((user) => user.user_id === authUser.user.id);
    setGroupMember(isMember);
  }, [users, authUser, setGroupMember]);

  if (loading) return <InlineLoader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-full w-full flex flex-col">
      <ul
        className={`flex-1 w-full py-1 overflow-y-auto${
          location.pathname === "/groups" ? " space-y-4" : " space-y-2"
        }`}
      >
        {users.map((user) => (
          <li key={user.user_id}>
            <Link
              to={`/users/${user.user_id}`}
              className={`hover:text-primary transition duration-200 ease-in-out flex items-center gap-2 p-1.5 bg-box border-stroke border rounded-full hover:shadow-sm`}
            >
              {user.profile_image_url ? (
                <img
                  className={`group-img`}
                  src={user.profile_image_url}
                  width={50}
                  height={50}
                  alt="profile"
                />
              ) : (
                <User size={50} className={`group-img`} />
              )}

              <h5>u/{user.username}</h5>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
