"use client";
import { Funnel } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { UI_LABEL, TEAM_META, TEAM_FROM_CSV } from "../app-config";
import { useTeamFilterStore } from "../useTeamFilterStore";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Topbar = () => {
  const { selectedTeams, toggleTeam, clear } = useTeamFilterStore();
  const activeTeamKeys = Object.values(TEAM_FROM_CSV);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-surface px-4 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="text-lg font-semibold">{UI_LABEL.topbar.title}</div>
      </div>

      {/* Center */}
      {selectedTeams.length > 0 && (
        <TooltipProvider>
          <div className="flex justify-center gap-1 pb-1 text-sm opacity-70">
            {selectedTeams.map((key) => {
              const meta = TEAM_META[key];
              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <span className="cursor-default">{meta.emoji}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{meta.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      )}

      {/* Right */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Funnel className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto space-y-1 px-4">
            {activeTeamKeys.map((key) => {
              const meta = TEAM_META[key];
              return (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedTeams.includes(key)}
                    onCheckedChange={() => toggleTeam(key)}
                  />
                  <span>
                    {meta.emoji} {meta.label}
                  </span>
                </div>
              );
            })}

            <label className="flex items-center gap-2 pt-2 border-t cursor-pointer text-muted-foreground hover:text-foreground">
              <Checkbox
                checked={selectedTeams.length === 0}
                onCheckedChange={() => clear()}
              />
              <span className="pl-5">Clear</span>
            </label>
          </PopoverContent>
        </Popover>
        <ModeToggle />
      </div>
    </header>
  );
};
