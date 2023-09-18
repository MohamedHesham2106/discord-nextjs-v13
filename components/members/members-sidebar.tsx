import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { ServerHeader } from "@/components/server/server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "@/components/server/server-search";
import { Crown, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "@/components/server/server-section";
import { ServerMember } from "@/components/server/server-member";

interface ServerSidebarProps {
  serverId: string;
}

const roleIcons = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <Crown className="mr-2 h-4 w-4 text-[#e2a72f]" />,
};

export const MemberSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) return redirect("/");

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  icon: roleIcons[member.role],
                  name: member.profile.name,
                  id: member.id,
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!members?.length && (
          <div className="mb-2 ">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember
                  key={member.id}
                  members={member}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
