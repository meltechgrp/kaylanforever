"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
} from "@/components/ui/drawer";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

interface DrawerComponentProps {
  open: boolean;
  children: React.ReactNode;
  path?: string;
}

export function DrawerComponent({
  children,
  open,
  path,
}: DrawerComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  function handleClose() {
    router.push(path ? path : pathname);
  }
  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        !open && handleClose();
      }}
      direction="right"
    >
      {children}
    </Drawer>
  );
}

interface DrawerComponentHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function DrawerComponentHeader(props: DrawerComponentHeaderProps) {
  return (
    <DrawerHeader
      className={cn(
        " px-0 flex justify-between items-start",
        !props.children && "justify-end",
        props.className
      )}
    >
      <div className=" space-y-2 flex-1">{props.children}</div>
      <DrawerClose className="p-1 border border-border rounded">
        <X className="text-primary w-6 h-6" />
      </DrawerClose>
    </DrawerHeader>
  );
}

interface DrawerComponentContentProps {
  className?: string;
  children: React.ReactNode;
}

export function DrawerComponentContent({
  className,
  children,
}: DrawerComponentContentProps) {
  return (
    <DrawerContent
      showBar={false}
      className={cn(
        " top-0 right-0 left-auto md:w-[30rem] w-full bottom-0 mt-0 px-3 overflow-y-scroll rounded-none",

        className
      )}
    >
      {children}
    </DrawerContent>
  );
}
