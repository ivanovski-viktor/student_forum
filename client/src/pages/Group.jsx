import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import InlineLoader from "../components/layout/InlineLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faCommentDots,
  faUserGroup,
  faClockFour,
} from "@fortawesome/free-solid-svg-icons";
import { formatRelativeTime } from "../helper-functions/timeFormat";
import MainLayout from "../components/layout/MainLayout";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Group() {
  const { name } = useParams();

  const {
    data: groupData,
    loading: loadingGroupData,
    error: groupError,
  } = useFetch(`${apiUrl}/groups/${name}`);

  if (loadingGroupData) return <InlineLoader />;
  if (groupError) return <p>Error: {groupError}</p>;
  const group = groupData?.group;
  if (!group) return <p>No Group found.</p>;

  return (
    <MainLayout>
      <div>{JSON.stringify(group)}</div>
      <div>test</div>
    </MainLayout>
  );
}
