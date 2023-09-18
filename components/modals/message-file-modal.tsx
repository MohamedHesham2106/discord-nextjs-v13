"use client";

import axios from "axios";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const schema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required.",
  }),
});
export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;

  const router = useRouter();
  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const url = qs.stringifyUrl({
      url: apiUrl || "",
      query,
    });
    await axios
      .post(url, { ...data, content: data.fileUrl })
      .then((res) => {
        form.reset();
        router.refresh();
        closeHandler();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const closeHandler = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={closeHandler}>
      <DialogContent className="bg-white dark:bg-[#313338] text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-zinc-500 dark:text-[#cdd0d3]">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 dark:text-[#cdd0d3]">
            Send a file as message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center py-5 dark:bg-[#1e1f22] ">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormMessage className="text-rose-500" />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 dark:bg-[#1e1f22] px-6 py-4">
              <Button variant={"primary"} disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
