import { Link } from "react-router-dom";

export default function User({ username, userId, profileImage }) {
  return (
    <Link
      to={`/users/${userId}`}
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
