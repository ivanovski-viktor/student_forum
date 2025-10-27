import { Link } from "react-router-dom";
import { User } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

export default function NavBar() {
  return (
    <nav className="p-4 border-b border-stroke flex  items-center  justify-between gap-4 bg-box text-foreground">
      <div className="flex items-center gap-2">
        <Link to="/" onClick={() => startLoading()}>
          Home
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          to="/users/me"
          className="flex items-center justify-center text-lg"
        >
          <User size={20} />
        </Link>
      </div>
    </nav>
  );
}
