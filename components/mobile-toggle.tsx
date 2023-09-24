import { Menu, Users } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components//server/server-sidebar";
import { MemberSidebar } from "./members/members-sidebar";

interface MobileToggleProps {
  serverId: string;
  type: "server-side-bar" | "member-side-bar";
}
export const MobileToggle = ({ serverId, type }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={"ghostIcon"}
          size="icon"
          className="md:hidden hover:bg-none"
        >
          {type === "server-side-bar" ? (
            <Menu className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          ) : (
            <Users className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          )}
        </Button>
      </SheetTrigger>
      {type === "server-side-bar" && (
        <SheetContent side="left" className="p-0 flex gap-0">
          <div className="w-[72px]">
            <NavigationSidebar />
          </div>
          <ServerSidebar serverId={serverId} />
        </SheetContent>
      )}
      {type === "member-side-bar" && (
        <SheetContent side="right" className="p-0 flex gap-0">
          <div className="w-full">
            <MemberSidebar serverId={serverId} />
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
};
