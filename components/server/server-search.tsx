"use client";

import { Search } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}
export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD + K or CTRL + K to open the search
      if (
        e.key === "k" &&
        (e.metaKey || (e.ctrlKey && data[0].type === "channel"))
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (
        e.key === "m" &&
        (e.metaKey || (e.ctrlKey && data[0].type === "member"))
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // on Unmount (cleanup)
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [data]);
  const clickHandler = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);
    if (type === "member") {
      return router.push(`/servers/${params.serverId}/conversations/${id}`);
    }
    if (type === "channel") {
      return router.push(`/servers/${params.serverId}/channels/${id}`);
    }
  };

  return (
    <Fragment>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">CTRL</span>
          {data[0].type === "channel" ? "K" : "M"}
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for channels and members" />
        <CommandList>
          <CommandEmpty>No Result found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;
            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ icon, name, id }) => {
                  return (
                    <CommandItem
                      onSelect={() => clickHandler({ id, type })}
                      className="cursor-pointer"
                      key={id}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </Fragment>
  );
};
