import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Search() {
  const [searchBody, setSearchBody] = useState({ type: "user", query: "" });
  const [searchResults, setSearchResults] = useState([]);

  const handleChangeType = (e) =>
    setSearchBody((prev) => ({ ...prev, type: e.target.value }));

  const handleChangeQuery = (e) =>
    setSearchBody((prev) => ({ ...prev, query: e.target.value }));

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchBody),
  };

  const { data } = useFetch(
    searchBody.query.length > 2 ? `${apiUrl}/search` : null,
    options
  );

  useEffect(() => {
    setSearchResults(data || []);
  }, [data]);

  return (
    <div className="relative z-10 w-96 max-w-full">
      <input
        value={searchBody.query}
        className="input bg-background border-primary py-3 hover:border-primary-light pr-20 relative z-10"
        placeholder="Пребарај..."
        onChange={handleChangeQuery}
      />
      <select
        value={searchBody.type}
        className="w-16 absolute h-2/3 border-l-primary top-[16%] right-4 z-20"
        onChange={handleChangeType}
      >
        <option className="text-foreground bg-background" value="user">
          User
        </option>
        <option className="text-foreground bg-background" value="group">
          Group
        </option>
        <option className="text-foreground bg-background" value="post">
          Post
        </option>
      </select>

      {searchBody.query.length > 2 && (
        <div className="absolute z-0 top-3/5 left-0 py-8 px-4 bg-background w-full rounded-b-3xl">
          {JSON.stringify(searchResults)}
        </div>
      )}
    </div>
  );
}
