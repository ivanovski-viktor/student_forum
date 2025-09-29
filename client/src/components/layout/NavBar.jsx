import { faUserAlt, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="p-4 border-b border-gray-200 flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/users/me">
        <FontAwesomeIcon icon={faUserAlt} />
      </Link>
    </nav>
  );
}
