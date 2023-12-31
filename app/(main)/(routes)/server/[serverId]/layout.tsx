import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { MemberSidebar } from "@/components/members/members-sidebar";
const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const server = await prisma.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (!server) {
    return redirect("/");
  }
  return (
    <div className="h-full flex justify-between">
      <div className="hidden md:flex h-full w-60 z-20 flex-col ">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full flex-1">{children}</main>
      <div className="hidden md:flex h-full w-60 z-20 flex-col ">
        <MemberSidebar serverId={params.serverId} />
      </div>
    </div>
  );
};
export default ServerIdLayout;
