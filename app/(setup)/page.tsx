import { initProfile } from "@/lib/init-profile";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModal from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initProfile();
  const server = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if(server)
  {
    return redirect(`/server/${server.id}`)
  }
  return <InitialModal/>;
};

export default SetupPage;
