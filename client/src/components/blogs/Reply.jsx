import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import InlineLoader from "../layout/InlineLoader";
import userPlaceholder from "../../assets/user-placeholder.png";
import CreatedAt from "../ui/CreatedAt";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import ModifyButton from "./ModifyButton";
import { RiDeleteBinFill, RiPencilFill } from "react-icons/ri";
import Message from "../ui/Message";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Reply({ reply }) {
  const { id, user_id, content } = reply;
  const token = localStorage.getItem("token");
  const replyUrl = `${apiUrl}/comments/${id}`;

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useFetch(`${apiUrl}/users/${user_id}`);

  const user = userData?.user || {};
  const { username, profile_image_url } = user;

  // handle delete reply
  const {
    exec: handleDeleteReply,
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useDeleteRequest(replyUrl, token);

  if (successDelete) {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  if (userLoading) return null;
  if (userError)
    return <div className="text-xs text-error">Error loading user</div>;

  return (
    <div key={id} className="mt-2 border-t pt-3 border-stroke">
      {errorDelete && <Message type="error" text={errorDelete} />}
      {successDelete && <Message text="Successfully deleted reply!" />}

      <div className=" flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link
            className="transition-colors duration-200 ease-in-out hover:text-primary flex items-center gap-2"
            to={`/users/${user_id}`}
          >
            <img
              className="profile-img"
              src={profile_image_url || userPlaceholder}
              height={30}
              width={30}
              alt="profile"
            />
            <h6>{username}</h6>
          </Link>
          <CreatedAt time={reply.created_at} />
        </div>
        <div className="flex items-center gap-2">
          <ModifyButton>
            <RiPencilFill />
          </ModifyButton>
          <ModifyButton
            onClick={handleDeleteReply}
            extraClass="modify-btn--hvr-red"
            popupText="Избриши"
          >
            {loadingDelete ? (
              <InlineLoader small={true} />
            ) : (
              <RiDeleteBinFill />
            )}
          </ModifyButton>
        </div>
      </div>

      <p className="mt-1 text-sm pl-10">{content}</p>
    </div>
  );
}
