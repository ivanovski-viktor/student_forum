import { Link, useLocation } from "react-router-dom";
import { usePageLoading } from "../../context/PageLoadingContext";

export default function NavItem({ to, children }) {
  const { setPageLoading } = usePageLoading();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={() => setPageLoading(true)}
      className={`flex items-center gap-2  py-2 lg:py-4 my-1 px-2 lg:px-4 transition duration-300 ease-in-out rounded-md last:mb-0 ${
        isActive ? "bg-foreground-light/10" : "bg-transparent hover:bg-box"
      }`}
    >
      {children}
    </Link>
  );
}
