"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";

export const InviteModal = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, onClose, type, data, onOpen } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "createInvite";
  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const onCopyHandler = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const onGenerateNewLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("createInvite", { server: response.data });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-[#313338] bg-[#f2f3f5] text-black  overflow-hidden px-2">
        <DialogHeader className="pt-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold dark:text-[#cdd0d3] text-zinc-500">
            Invite Friends to {server?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-[#cdd0d3]">
            Send Server Link to a friend
          </Label>
          <div className="bg-black dark:bg-[#1e1f22] rounded mt-2 items-center  gap-x-2 flex pr-2 py-1.5 justify-between">
            <Input
              disabled={isLoading}
              className="dark:bg-[#1e1f22] bg-transparent border-0 focus-visible:ring-0 dark:text-[#cdd0d3] text-white focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button
              disabled={isLoading}
              className="w-[86px] h-10"
              onClick={onCopyHandler}
              size="icon"
            >
              {copied ? (
                <Button className="text-white border-none bg-indigo-500 hover:bg-indigo-500 w-[86px] h-10">
                  Copied!
                </Button>
              ) : (
                <Button className="text-white border-none bg-indigo-500 hover:bg-indigo-800  w-[86px] h-10 ">
                  Copy
                </Button>
              )}
            </Button>
          </div>
          <Button
            onClick={onGenerateNewLink}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500/90 dark:text-[#cdd0d3] mt-4"
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
