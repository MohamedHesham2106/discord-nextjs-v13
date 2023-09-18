"use client";
import qs from "query-string";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useParams, useRouter } from "next/navigation";

export const DeleteChannelModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;
  const onDeleteChannel = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.delete(url);
      onClose();
      router.refresh();
      router.push(`/server/${server?.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-[#313338] bg-[#f2f3f5] text-black  overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl text-center font-bold text-zinc-500 dark:text-[#cdd0d3]">
            Delete Channel
          </DialogTitle>
          <DialogDescription className=" text-zinc-500 dark:text-[#cdd0d3] text-center">
            Are you sure you want to do this?
            <br />
            <span className="text-indigo-500">#{channel?.name}</span> will be{" "}
            <span className="text-rose-500 font-bold">
              permenantly deleted.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="dark:bg-[#1e1f22] bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onDeleteChannel}
              variant="primary"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
