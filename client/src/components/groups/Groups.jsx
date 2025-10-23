import { Link, useLocation } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import { Users } from "lucide-react";
import LinkUnderline from "../ui/LinkUnderline";

export default function Groups({ url }) {
  const location = useLocation();
  const { data: groupsData, loading, error } = useFetch(url);

  if (loading) return <InlineLoader />;
  if (error) return <p>Error: {error}</p>;

  // limit to 6
  const groups =
    location.pathname === "/groups"
      ? groupsData.groups
      : groupsData.groups.slice(0, 6);

  return (
    <div className="h-full w-full flex flex-col">
      <ul
        className={`flex-1 w-full py-1 overflow-y-auto${
          location.pathname === "/groups" ? " space-y-4" : " space-y-2"
        }`}
      >
        {groups.map((group) => (
          <li key={group.name}>
            <Link
              to={`/groups/${group.name}`}
              className={`hover:text-primary transition duration-200 ease-in-out flex items-center gap-2 p-3 bg-box border-stroke border rounded-md hover:shadow-sm${
                location.pathname === "/groups" ? " p-4 gap-3" : ""
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
                  className={`group-img${
                    location.pathname == "/groups" ? " group-img--large" : ""
                  }`}
                />
              )}

              <h5 className={location.pathname !== "/groups" && "h6"}>
                g/{group.name}
              </h5>
            </Link>
          </li>
        ))}
      </ul>
      {location.pathname !== "/groups" && (
        <div className="pt-2">
          <LinkUnderline link="/groups" text="View All" />
        </div>
      )}
    </div>
  );
}
