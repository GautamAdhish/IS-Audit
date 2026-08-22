import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-950/40" />
      <Dialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
          "max-h-[85vh] overflow-y-auto rounded-3xl bg-white shadow-2xl focus:outline-none",
          sizeClasses[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-ink-900/8">
          <div className="min-w-0">
            <Dialog.Title className="text-sm font-semibold text-ink-900 truncate">
              {title}
            </Dialog.Title>
            <Dialog.Description
              className={description ? "text-xs text-slate-500 mt-0.5" : "sr-only"}
            >
              {description || `${title} dialog`}
            </Dialog.Description>
          </div>
          <Dialog.Close
            aria-label="Close"
            className="p-1 rounded-md text-slate-400 hover:text-ink-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 shrink-0"
          >
            <X className="w-4 h-4" />
          </Dialog.Close>
        </div>

        <div className="p-5">{children}</div>

        {footer && (
          <div className="px-5 py-4 border-t border-ink-900/8 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal;
