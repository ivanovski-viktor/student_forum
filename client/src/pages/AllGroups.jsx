import { useState } from "react";
import AddGroupModal from "../components/groups/AddGroupModal";
import Groups from "../components/groups/Groups";
import MainLayout from "../components/layout/MainLayout";

import { useAuthUser } from "../context/AuthUserContext";
import LogInCta from "../components/ui/LogInCta";

const apiUrl = import.meta.env.VITE_API_URL;
export default function AllGroups() {
  const { authUser, isAuthenticated } = useAuthUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MainLayout>
      <div className="">
        {isAuthenticated && (
          <>
            <div className="flex items-center justify-between my-5">
              <h2 className="h3">Креирај група</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn--primary inline-flex items-center gap-1 m-0"
              >
                Креирај
              </button>
            </div>

            <AddGroupModal
              url={`${apiUrl}/groups`}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </>
        )}
        {!isAuthenticated && (
          <LogInCta text="Најави се за да објавиш нешто..." />
        )}
        <Groups url={`${apiUrl}/groups`} />
      </div>
    </MainLayout>
  );
}
