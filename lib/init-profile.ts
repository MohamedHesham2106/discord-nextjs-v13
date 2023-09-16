import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { prisma } from "@/lib/db";

// Initialize a profile for the current user
export async function initProfile() {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });
  if (profile) {
    return profile;
  }
  const newProfile = await prisma.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    },
  });
  return newProfile;
}
