import React from "react";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { cn } from "../../utils/cn";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  contentClassName?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  align = "end",
  contentClassName,
}) => (
  <RadixDropdown.Root>
    <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        align={align}
        sideOffset={8}
        className={cn(
          "z-50 bg-white rounded-2xl shadow-[0_8px_24px_rgba(16,26,46,0.12)] overflow-hidden focus:outline-none",
          contentClassName,
        )}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  </RadixDropdown.Root>
);

export default DropdownMenu;

export const DropdownMenuItem: React.FC<
  React.ComponentProps<typeof RadixDropdown.Item>
> = ({ className, ...props }) => (
  <RadixDropdown.Item className={cn("outline-none", className)} {...props} />
);
