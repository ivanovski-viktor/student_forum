import Comment from "./Comment";
import CommentOnPost from "./CommentOnPost";

export default function CommentSection({ comments }) {
  return (
    <>
      <CommentOnPost />

      <div className="space-y-3">
        {comments &&
          [...comments]
            .reverse()
            .map((comment) => <Comment key={comment.id} comment={comment} />)}
      </div>
    </>
  );
}
