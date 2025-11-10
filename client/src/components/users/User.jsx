import { Link } from "react-router-dom";
import { usePageLoading } from "../../context/PageLoadingContext";

export default function User({ username, userId, profileImage }) {
  const { setPageLoading } = usePageLoading();

  return (
    <Link
      to={`/users/${userId}`}
      onClick={() => setPageLoading(true)}
      className="transition-colors duration-200 ease-in-out hover:text-primary flex items-center gap-2"
    >
      <img
        className="profile-img"
        src={profileImage}
        width={30}
        height={30}
        alt="profile"
      />
      <h6>{username}</h6>
    </Link>
  );
}
