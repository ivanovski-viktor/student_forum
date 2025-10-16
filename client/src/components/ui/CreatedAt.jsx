import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatRelativeTime } from "../../helper-functions/timeFormat";
import { faClock, faDotCircle } from "@fortawesome/free-solid-svg-icons";

export default function CreatedAt({ time }) {
  return (
    <span className="flex items-center gap-0.5 text-xs text-gray-400 border-gray-300">
      &bull; {formatRelativeTime(time)}
    </span>
  );
}
