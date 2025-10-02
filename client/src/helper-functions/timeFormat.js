export function formatDateTime(dateString) {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleString("en-GB", options);
}

export function formatRelativeTime(dateString) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);

  const ranges = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(ranges)) {
    if (seconds >= value || unit === "second") {
      const diff = Math.floor(seconds / value);
      return rtf.format(-diff, unit);
    }
  }
}
