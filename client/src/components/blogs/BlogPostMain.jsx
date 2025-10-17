import {
  RiArrowUpFill,
  RiArrowDownFill,
  RiMessage2Line,
  RiGroup2Fill,
  RiPencilFill,
  RiDeleteBinFill,
} from "react-icons/ri";

import CreatedAt from "../ui/CreatedAt";

export default function BlogPostMain({ post }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!post.group_name ? (
            <span className="text-sm text-foreground-light mb-1 inline-flex gap-1 items-center">
              <RiGroup2Fill className="text-lg" />
              <span>/general</span>
            </span>
          ) : (
            <span className="text-sm text-foreground-light mb-1 inline-flex gap-1 items-center">
              <RiGroup2Fill className="text-lg" />

              <span>/{post.group_name}</span>
            </span>
          )}

          <CreatedAt time={post.created_at} />
        </div>
        <div className="flex items-center gap-2">
          <button className="icon-link relative group">
            <RiPencilFill />
            <div className="bg-box0 px-2 py-1 rounded-sm absolute bottom-[110%] left-0 opacity-0 group-hover:opacity-100 text-background text-[10px] max-lg:hidden pointer-events-none">
              Измени
            </div>
          </button>
          <button className="icon-link icon-link--hvr-red relative group">
            <RiDeleteBinFill />
            <div className="bg-box0 px-2 py-1 rounded-sm absolute bottom-[110%] left-0 opacity-0 group-hover:opacity-100 text-background text-[10px] max-lg:hidden pointer-events-none">
              Избриши
            </div>
          </button>
        </div>
      </div>
      <h2 className="mb-2">{post.title}</h2>
      <p className="text-foreground-light mb-4 text-sm">{post.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-foreground-light items-center">
        <span className="flex items-center gap-1">
          <RiArrowUpFill />
          {post.upvotes}
        </span>
        <span className="flex items-center gap-1">
          <RiArrowDownFill />
          {post.downvotes}
        </span>
        <span className="flex items-center gap-1">
          <RiMessage2Line />
          {post.comment_count} comments
        </span>
      </div>
    </div>
  );
}
