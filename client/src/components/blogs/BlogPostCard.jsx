import { Link } from "react-router-dom";
import {
  RiArrowUpFill,
  RiArrowDownFill,
  RiMessage2Line,
  RiGroup2Fill,
} from "react-icons/ri";
import CreatedAt from "../ui/CreatedAt";

export default function BlogPostCard({ post }) {
  return (
    <li>
      <div className="bg-box border border-stroke rounded-xl p-5 hover:bg-box hover:shadow-sm transition-all duration-200 flex flex-col items-start relative">
        <Link
          className="absolute top-0 left-0 w-full h-full z-0"
          to={`/posts/${post.id}`}
        ></Link>
        <div className="flex items-center gap-2">
          {!post.group_name ? (
            <span className="text-sm text-foreground-light mb-1 inline-flex gap-1 items-center">
              <RiGroup2Fill className="text-lg" />
              <span>/general</span>
            </span>
          ) : (
            <Link
              to={`/groups/${post.group_name}`}
              className="text-sm text-primary hover:underline mb-1 inline-flex gap-1 items-center relative z-10"
            >
              <RiGroup2Fill className="text-lg" />
              <span>/{post.group_name}</span>
            </Link>
          )}
          <CreatedAt time={post.created_at} />
        </div>

        <Link to={`/posts/${post.id}`}>
          <h3 className="hover:text-primary transition-colors duration-200 ease-in-out mb-2 relative z-10">
            {post.title}
          </h3>
        </Link>

        <p className="text-foreground-light mb-4 ">{post.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-foreground-light items-center ">
          <span className="flex items-center gap-1 relative z-10">
            <RiArrowUpFill />
            {post.upvotes}
          </span>
          <span className="flex items-center gap-1 relative z-10">
            <RiArrowDownFill />
            {post.downvotes}
          </span>
          <span className="flex items-center gap-1">
            <RiMessage2Line />
            {post.comment_count} comments
          </span>
        </div>
      </div>
    </li>
  );
}
