import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="bg-[url('/img/discord-background.png')] w-full h-screen flex items-center justify-center bg-cover bg-no-repeat">
      <SignIn />
    </div>
  );
}
