import { useFetch } from "../../hooks/useFetch";
import User from "../users/User";
import userPlaceholder from "../../assets/user-placeholder.png";
import InlineLoader from "../layout/InlineLoader";

const apiUrl = import.meta.env.VITE_API_URL;

export default function BlogAuthor({ authorId }) {
  const { data, loading } = useFetch(`${apiUrl}/users/${authorId}`);

  return loading ? (
    <InlineLoader small={true} />
  ) : (
    <div className="mt-2 w-max max-w-full">
      <User
        username={data.user.username}
        userId={data.user.id}
        profileImage={data.user.profile_image_url || userPlaceholder}
      />
    </div>
  );
}
