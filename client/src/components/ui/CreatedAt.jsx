import { formatRelativeTime } from "../../helper-functions/timeFormat";

export default function CreatedAt({ time }) {
  return (
    <span className="flex items-center gap-0.5 text-xs text-foreground-light border-stroke">
      &bull; {formatRelativeTime(time)}
    </span>
  );
}
