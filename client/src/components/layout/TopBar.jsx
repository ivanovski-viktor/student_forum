import { Link } from "react-router-dom";
import { User } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { usePageLoading } from "../../context/PageLoadingContext";
import Search from "../ui/Search";
import sfLogo from "../../assets/sf-logo.webp";

export default function TopBar() {
  const { setPageLoading } = usePageLoading();

  return (
    <nav className="px-4 py-2.5 border-b border-stroke flex  items-center  justify-between gap-4 bg-box text-foreground">
      <div className="flex items-center gap-2">
        <Link to="/" onClick={() => setPageLoading(true)}>
          <img src={sfLogo} width={50} height={50} alt="" />
        </Link>
      </div>
      <div>
        <Search />
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
