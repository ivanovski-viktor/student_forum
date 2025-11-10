import { Link } from "react-router-dom";
import { Menu, User } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { usePageLoading } from "../../context/PageLoadingContext";
import Search from "../ui/Search";
import sfLogo from "../../assets/sf-logo.webp";

export default function TopBar() {
  const { setPageLoading } = usePageLoading();

  return (
    <nav className="px-4 py-2 border-b border-stroke flex  items-center  justify-between gap-2 sm:gap-4 bg-background text-foreground sticky z-50 top-0">
      <Link
        className="flex items-center gap-2"
        to="/"
        onClick={() => setPageLoading(true)}
      >
        <img
          className=" w-10 h-10 xl:w-12 xl:h-12 shrink-0"
          src={sfLogo}
          width={50}
          height={50}
          alt=""
        />
        <span className="text-xs xl:text-sm font-bold leading-[1] max-sm:hidden">
          Student
          <br />
          Forum
        </span>
      </Link>

      <Search />

      <div className="flex items-center gap-2 max-md:hidden">
        <ThemeToggle />
        <Link
          to="/users/me"
          onClick={() => setPageLoading(true)}
          className="flex items-center justify-center text-lg"
        >
          <User size={20} />
        </Link>
      </div>
      <div className="md:hidden">
        <Menu />
      </div>
    </nav>
  );
}
