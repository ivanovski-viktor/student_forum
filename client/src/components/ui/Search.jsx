import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { FileText, SearchIcon, User, Users, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import InlineLoader from "../layout/InlineLoader";
import { usePageLoading } from "../../context/PageLoadingContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Search() {
  const { setPageLoading } = usePageLoading();
  const [searchBody, setSearchBody] = useState({ type: "", query: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const location = useLocation();

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchBody.query), 300);
    return () => clearTimeout(handler);
  }, [searchBody.query]);

  const handleChangeType = (e) =>
    setSearchBody((prev) => ({ ...prev, type: e.target.value }));

  const handleChangeQuery = (e) =>
    setSearchBody((prev) => ({ ...prev, query: e.target.value }));

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...searchBody, query: debouncedQuery }),
  };

  const { data, loading } = useFetch(
    debouncedQuery.length > 2 ? `${apiUrl}/search` : null,
    options
  );

  useEffect(() => {
    setSearchResults(data || []);
  }, [data]);

  useEffect(() => {
    setSearchBody({ type: "", query: "" });
    setSearchResults([]);
  }, [location.pathname]);

  const getLink = (res) => {
    switch (res.type) {
      case "group":
        return `/groups/${res.name}`;
      case "post":
        return `/posts/${res.id}`;
      case "user":
        return `/users/${res.id}`;
      default:
        return "#";
    }
  };

  return (
    <div className="relative z-50 w-96 max-w-4/5">
      <input
        name="search-field"
        value={searchBody.query}
        className="input bg-background border-stroke text-foreground-light placeholder:text-foreground-light py-2.5  pr-20 relative z-50 pl-10 transition-colors duration-200 ease-in-out"
        placeholder="Пребарај..."
        onChange={handleChangeQuery}
      />

      {searchBody.query.length > 0 ? (
        <X
          onClick={() => setSearchBody({ ...searchBody, query: "" })}
          width={20}
          className="absolute top-0 left-0 h-full w-10 pl-3 pr-2 z-50 text-foreground cursor-pointer hover:text-primary transition-colors duration-200 ease-in-out"
        />
      ) : (
        <SearchIcon
          width={20}
          className="absolute top-0 left-0 h-full w-10 pl-3 pr-2 z-50 text-foreground pointer-events-none"
        />
      )}

      <select
        name="select-search-type"
        value={searchBody.type}
        className="w-16 absolute h-2/3 border-l-primary top-[16%] right-4 z-50"
        onChange={handleChangeType}
      >
        <option className="text-foreground bg-background" value="">
          All
        </option>
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

      {debouncedQuery.length > 2 && (
        <div className="absolute z-40 top-3/5 left-0 py-8 px-4 bg-background w-full rounded-b-3xl shadow-md overflow-hidden max-h-[80dvh] h-84 border border-stroke">
          <h6>Search Results:</h6>
          <div className="mt-2 space-y-2 overflow-y-auto max-h-full flex flex-col">
            {loading ? (
              <InlineLoader />
            ) : searchResults.results?.length > 0 ? (
              searchResults.results.map((res) => {
                let placeholderIcon = null;
                if (res.type === "user")
                  placeholderIcon = (
                    <User className="w-8 h-8 text-muted-foreground" />
                  );
                if (res.type === "group")
                  placeholderIcon = (
                    <Users className="w-8 h-8 text-muted-foreground" />
                  );
                if (res.type === "post")
                  placeholderIcon = (
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  );

                return (
                  <Link
                    to={getLink(res)}
                    key={`${res.type}-${res.id}-${res.name}`}
                    onClick={() => setPageLoading(true)}
                    className="flex items-center gap-3 p-2 cursor-pointer transition border-b border-stroke last:border-0 last:pb-0 group"
                  >
                    {res.image_url ? (
                      <img
                        src={res.image_url}
                        alt={res.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {placeholderIcon}
                      </div>
                    )}

                    <div className="flex flex-col">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 ease-in-out">
                        {res.name}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {res.type}
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
