import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { createOrGetConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";

interface MemeberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}
const MemeberIdPage = async ({ params }: MemeberIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const currentMember = await prisma.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) {
    return redirect("/");
  }
  const conversation = await createOrGetConversation(
    currentMember.id,
    params.memberId
  );
  if (!conversation) {
    return redirect(`/server/${params.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
    </div>
  );
};

export default MemeberIdPage;
