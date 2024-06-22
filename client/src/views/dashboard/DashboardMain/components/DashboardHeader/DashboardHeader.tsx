import { FiLogOut, FiPlus } from "react-icons/fi";

import { Button } from "@/components";

export const DashboardHeader = ({
  onCreateClicked,
  onLogOutClicked,
}: {
  onCreateClicked: () => void;
  onLogOutClicked: () => void;
}): JSX.Element => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl mb-12">
      <div className="w-full mb-4 sm:mb-0 sm:w-auto text-2xl sm:text-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/taskbase-logo.png"
          className="h-9 mx-auto object-contain"
          alt="TaskBase Logo"
        />
      </div>
      <div className="w-full sm:w-auto flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={onCreateClicked}>
          <FiPlus className="mr-2" />
          Add Task
        </Button>
        <Button variant="outline" size="sm" onClick={onLogOutClicked}>
          <FiLogOut className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
