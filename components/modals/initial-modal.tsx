"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useOrigin } from "@/hooks/use-origin";
const DEFAULT_SERVER_INVITE_CODE="f083a77c-f231-4e67-8ef8-421d9ad02485"
export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();
  const user = useUser();
  const origin = useOrigin();
  const inviteUrl = `${origin}/invite/${DEFAULT_SERVER_INVITE_CODE}`;
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const submitHandler = async ()=>{
    router.push(inviteUrl)
  }
  return (
    <Dialog open>
      <DialogContent className="dark:bg-[#313338] bg-[#f2f3f5] text-black  overflow-hidden px-2">
        <DialogHeader className="pt-2 px-6">
          <DialogTitle className="text-4xl text-center font-bold dark:text-[#cdd0d3] text-zinc-500">
            Welcome to Discord Clone
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-zinc-500 dark:text-[#cdd0d3]">
            🚀 Welcome to Discord Clone, crafted with love by Mohamed Hesham! 🌟
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pt-3">
          <Button onClick={submitHandler} variant='primary' className="w-full">Get Started</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
