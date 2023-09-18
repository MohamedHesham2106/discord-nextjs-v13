import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Crown, Hash, Mic, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "./server-section";
import { text } from "stream/consumers";
import { ServerChannel } from "./server-channel";

interface ServerSidebarProps {
  serverId: string;
}
const channelIcons = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4 text-[#cdd0d3]" />,
  [ChannelType.VOICE]: <Mic className="mr-2 h-4 w-4 text-[#cdd0d3]" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4 text-[#cdd0d3]" />,
};
const roleIcons = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <Crown className="mr-2 h-4 w-4 text-[#e2a72f]" />,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
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

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const voiceChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VOICE
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) return redirect("/");

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  icon: channelIcons[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: voiceChannels?.map((channel) => ({
                  icon: channelIcons[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  icon: channelIcons[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2 ">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  server={server}
                  channel={channel}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!voiceChannels?.length && (
          <div className="mb-2 ">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VOICE}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {voiceChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  server={server}
                  channel={channel}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2 ">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VOICE}
              role={role}
              label="Video Channels"
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                server={server}
                channel={channel}
                role={role}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
