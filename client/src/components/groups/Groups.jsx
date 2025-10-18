import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";

export default function Groups({ url }) {
  const { data: groupsData, loading, error } = useFetch(url);

  if (loading) return <InlineLoader />;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul className="space-y-4">
      {groupsData.groups.map((group) => (
        <li key={group.name}>
          <Link to={`/groups/${group.name}`}>{group.name}</Link>
        </li>
      ))}
    </ul>
  );
}
