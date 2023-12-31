"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { Crown, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";

const roleIcons = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-l h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <Crown className="ml-2 h-4 w-4 text-[#e2a72f]" />,
};
interface ServerMemberProps {
  members: Member & { profile: Profile };
  server: Server;
}
export const ServerMember = ({ members, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIcons[members.role];
  const onClickHandler = () => {
    router.push(`/server/${params?.serverId}/conversations/${members.id}`);
  };
  return (
    <button
      onClick={onClickHandler}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === members.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={members.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === members.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {members.profile.name}
      </p>
      {icon}
    </button>
  );
};
