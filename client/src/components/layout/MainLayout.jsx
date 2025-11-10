import React from "react";
import { Link } from "react-router-dom";
import LinkUnderline from "../ui/LinkUnderline";
import { FileText, House, User, Users, Users2, UsersIcon } from "lucide-react";
import { usePageLoading } from "../../context/PageLoadingContext";
import NavItem from "../ui/NavItem";
import { useAuthUser } from "../../context/AuthUserContext";
import BrandInformation from "../ui/BrandInformation";

export default function Home({ children }) {
  const { setPageLoading } = usePageLoading();
  const { isAuthenticated } = useAuthUser();

  // Requires 2 children
  const childArray = React.Children.toArray(children);

  return (
    <div className="max-md:flex max-md:flex-col-reverse md:grid md:grid-cols-12 md:min-h-screen">
      {/* nav menu */}
      <div className="col-span-3 xl:col-span-2 border-r border-stroke bg-background max-md:hidden">
        <div className="p-2 xl:p-5 !pt-0 flex flex-col sticky top-20 border-b border-stroke">
          <NavItem to="/">
            <House size={20} />
            Home
          </NavItem>

          <NavItem to="/posts">
            <FileText size={20} />
            Latest Posts
          </NavItem>

          <NavItem to="/groups">
            <Users size={20} />
            Groups
          </NavItem>

          <NavItem to="/users/me">
            <User size={20} />
            {isAuthenticated ? "My Profile" : "Login"}
          </NavItem>
        </div>
      </div>

      {/* main content */}
      <div className="col-span-6 col-start-4 p-5 ">{childArray[0]}</div>

      {/* right sidebar */}
      <div className="col-span-3 p-5 md:pl-0 max-md:pb-0">
        <div className="md:sticky md:top-21.5 md:min-h-[86svh] gap-5 flex flex-col items-stretch justify-between">
          {childArray[1] && (
            <div className="bg-box rounded-xl p-5 md:p-2 lg:p-3 xl:p-5 transition-all duration-200 flex md:h-86 min-h-46 max-h-[25svh] md:max-h-[50svh] 2xl:mr-20">
              {childArray[1]}
            </div>
          )}

          <div className="max-md:hidden">
            <BrandInformation />
          </div>
        </div>
      </div>
    </div>
  );
}
