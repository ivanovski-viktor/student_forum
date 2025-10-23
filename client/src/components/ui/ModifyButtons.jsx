import ModifyButton from "./ModifyButton";

import InlineLoader from "../layout/InlineLoader";
import { useFetch } from "../../hooks/useFetch";
import { Pencil, Trash2 } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ModifyButtons({
  token,
  userId,
  authUser = null,
  onClickEdit,
  onClickDelete,
  loadingEdit,
  editing,
  loadingDelete,
}) {
  let authUserId = authUser?.user?.id;

  // if no authuser is passed fetch authuserdata
  if (token && !authUser) {
    const { data: authUserData } = useFetch(`${apiUrl}/users/me`, {
      headers: { "Content-Type": "application/json", Authorization: token },
    });

    authUserId = authUserData?.user?.id;
  }

  if (token === null || authUserId !== userId) return null;
  return (
    <div className="flex items-center gap-2">
      <ModifyButton active={editing} onClick={onClickEdit}>
        {loadingEdit ? <InlineLoader small={true} /> : <Pencil size={20} />}
      </ModifyButton>
      <ModifyButton
        onClick={onClickDelete}
        extraClass="modify-btn--hvr-red"
        popupText="Избриши"
      >
        {loadingDelete ? <InlineLoader small={true} /> : <Trash2 size={20} />}
      </ModifyButton>
    </div>
  );
}
