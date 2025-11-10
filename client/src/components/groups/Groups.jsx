import { Link, useLocation } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import { ChartNetworkIcon, Users } from "lucide-react";
import LinkUnderline from "../ui/LinkUnderline";
import { usePageLoading } from "../../context/PageLoadingContext";
import { useEffect } from "react";

export default function Groups({ url }) {
  const { pageLoading, setPageLoading } = usePageLoading();
  const location = useLocation();
  const { data: groupsData, loading, error } = useFetch(url);

  useEffect(() => {
    if (pageLoading === true && groupsData) {
      setPageLoading(false);
    }
  }, [pageLoading, groupsData]);

  if (loading) return <InlineLoader />;
  if (error) return <p>Error: {error}</p>;

  // limit to 6
  const groups =
    location.pathname === "/groups"
      ? groupsData.groups
      : groupsData.groups.slice(0, 6);

  return (
    <div className="w-full">
      {location.pathname !== "/groups" && (
        <h5 className="flex items-center gap-2">
          <ChartNetworkIcon size={16} />
          <span>Нови групи</span>
        </h5>
      )}

      <div className="h-full w-full flex flex-col max-md">
        <ul
          className={`flex-1 w-full py-1 pr-1 overflow-y-auto${
            location.pathname === "/groups" ? " space-y-4" : " space-y-1.5"
          }`}
        >
          {groups.map((group) => (
            <li key={group.name}>
              <Link
                to={`/groups/${group.name}`}
                onClick={() => setPageLoading(true)}
                className={`transition-[background-color] duration-200 ease-in-out flex items-center gap-2 p-2 px-2 xl:px-3 rounded-md hover:bg-box${
                  location.pathname === "/groups" ? " p-4 gap-3 bg-box" : ""
                }`}
              >
                {group.group_image_url ? (
                  <img
                    className={`group-img${
                      location.pathname === "/groups" ? " group-img--large" : ""
                    }`}
                    src={group.group_image_url}
                    width={50}
                    height={50}
                    alt="profile"
                  />
                ) : (
                  <Users
                    size={50}
                    className={`group-img bg-gray-200 text-black/80 ${
                      location.pathname == "/groups" ? " group-img--large" : ""
                    }`}
                  />
                )}

                <h5 className={location.pathname !== "/groups" ? "h6" : ""}>
                  g/{group.name}
                </h5>
              </Link>
            </li>
          ))}
        </ul>
        {location.pathname !== "/groups" && (
          <div className="pt-1 pb-4">
            <LinkUnderline link="/groups" text="View All" />
          </div>
        )}
      </div>
    </div>
  );
}
