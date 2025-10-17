import { RiUserFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="p-4 border-b border-stroke flex gap-4 bg-box text-foreground">
      <Link to="/">Home</Link>
      <Link to="/users/me" className="flex items-center justify-center text-lg">
        <RiUserFill />
      </Link>
    </nav>
  );
}
