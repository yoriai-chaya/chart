import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { UI_LABEL } from "../app-config";

export const Topbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-surface px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="text-lg font-semibold">
          <div>{UI_LABEL.topbar.title}</div>
        </div>
      </div>
      <ModeToggle />
    </header>
  );
};
