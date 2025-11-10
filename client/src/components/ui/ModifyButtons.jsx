import ModifyButton from "./ModifyButton";

import InlineLoader from "../layout/InlineLoader";
import { useFetch } from "../../hooks/useFetch";
import { Pencil, Trash2 } from "lucide-react";
import EditPostModal from "../blogs/EditBlogPostMoldal";
import { useAuthUser } from "../../context/AuthUserContext";
import { useState } from "react";

export default function ModifyButtons({
  url,
  userId,
  onClickEdit,
  onClickDelete,
  loadingEdit,
  editing,
  loadingDelete,
  post,
}) {
  const { authUser, isAuthenticated } = useAuthUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const authUserId = authUser?.user?.id;

  if (authUserId !== userId || !isAuthenticated) return null;
  return (
    <div className="flex items-center gap-2">
      <ModifyButton active={editing} onClick={() => setIsModalOpen(true)}>
        {loadingEdit ? <InlineLoader small={true} /> : <Pencil size={20} />}
      </ModifyButton>
      <ModifyButton
        onClick={onClickDelete}
        extraClass="modify-btn--hvr-red"
        popupText="Избриши"
      >
        {loadingDelete ? <InlineLoader small={true} /> : <Trash2 size={20} />}
      </ModifyButton>

      <EditPostModal
        post={post}
        url={url}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
