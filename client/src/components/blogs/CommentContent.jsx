import InlineLoader from "../layout/InlineLoader";
import Message from "../ui/Message";

export default function CommentContent({
  editComment,
  setEditComment,
  handleUpdateComment,
  loadingUpdate,
  errorUpdate,
  successUpdate,
  commentObj,
  contentData,
  setContentData,
}) {
  return (
    <form
      className="flex flex-col pl-9 items-start gap-1 justify-stretch"
      onSubmit={(e) => {
        e.preventDefault();
        if (commentObj.content !== contentData) {
          handleUpdateComment();
        } else {
          setEditComment(false);
        }
      }}
    >
      <input
        onChange={(e) => setContentData(() => e.target.value)}
        className={`mt-1 text-sm w-full p-1 ${
          editComment && "input input--secondary"
        }`}
        disabled={!editComment}
        value={contentData}
        required
      />
      {loadingUpdate && <InlineLoader small={true} />}
      {errorUpdate && <Message type="error" text={errorUpdate} />}
      {successUpdate && <Message text="Updated successfully!" />}
      {editComment && (
        <div className="flex w-full gap-2 items-center justify-start text-xs">
          <button
            type="submit"
            className="btn-underline btn-underline--success"
          >
            Save
          </button>
          <button
            type="button"
            className="btn-underline btn-underline--error"
            onClick={() => {
              setEditComment(false);
              setContentData(commentObj.content);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}
