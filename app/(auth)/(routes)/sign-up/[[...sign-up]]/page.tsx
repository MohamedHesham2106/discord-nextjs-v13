import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="bg-[url('/img/discord-background.png')] w-full h-screen flex items-center justify-center bg-cover bg-no-repeat">
      <SignUp />
    </div>
  );
}
