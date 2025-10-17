import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import userPlaceholder from "../../assets/user-placeholder.png";
import CreatedAt from "../ui/CreatedAt";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Reply({ reply }) {
  const { id, user_id, content } = reply;

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useFetch(`${apiUrl}/users/${user_id}`);

  const user = userData?.user || {};
  const { username, profile_image_url } = user;

  if (userLoading) return null;
  if (userError)
    return <div className="text-xs text-error">Error loading user</div>;

  return (
    <div key={id} className="mt-2 border-t pt-3 border-stroke">
      <div className="flex items-center gap-1">
        <Link
          className="transition-colors duration-200 ease-in-out hover:text-primary flex items-center gap-2"
          to={`/users/${user_id}`}
        >
          <img
            className="rounded-full w-8 h-8 object-cover bg-primary"
            src={profile_image_url || userPlaceholder}
            alt="profile"
          />
          <h6>{username}</h6>
        </Link>
        <CreatedAt time={reply.created_at} />
      </div>
      <p className="mt-1 text-sm pl-10">{content}</p>
    </div>
  );
}
