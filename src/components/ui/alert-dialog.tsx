import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface AlertDialogProps extends React.ComponentProps<typeof AlertDialogPrimitive.Root> {}

const AlertDialog: React.FC<AlertDialogProps> = (props) => {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
};

interface AlertDialogTriggerProps extends React.ComponentProps<typeof AlertDialogPrimitive.Trigger> {}

const AlertDialogTrigger: React.FC<AlertDialogTriggerProps> = (props) => {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
};

interface AlertDialogPortalProps extends React.ComponentProps<typeof AlertDialogPrimitive.Portal> {}

const AlertDialogPortal: React.FC<AlertDialogPortalProps> = (props) => {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
};

interface AlertDialogOverlayProps extends React.ComponentProps<typeof AlertDialogPrimitive.Overlay> {
  className?: string;
}

const AlertDialogOverlay: React.FC<AlertDialogOverlayProps> = ({ className, ...props }) => {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
};

interface AlertDialogContentProps extends React.ComponentProps<typeof AlertDialogPrimitive.Content> {
  className?: string;
}

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ className, ...props }) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
};

interface AlertDialogHeaderProps extends React.ComponentProps<typeof AlertDialogPrimitive.Header> {
  className?: string;
}

const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
};

interface AlertDialogFooterProps extends React.ComponentProps<typeof AlertDialogPrimitive.Footer> {
  className?: string;
}

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
};

interface AlertDialogTitleProps extends React.ComponentProps<typeof AlertDialogPrimitive.Title> {
  className?: string;
}

const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ className, ...props }) => {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
};

interface AlertDialogDescriptionProps extends React.ComponentProps<typeof AlertDialogPrimitive.Description> {
  className?: string;
}

const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ className, ...props }) => {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

interface AlertDialogActionProps extends React.ComponentProps<typeof AlertDialogPrimitive.Action> {
  className?: string;
}

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ className, ...props }) => {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
};

interface AlertDialogCancelProps extends React.ComponentProps<typeof AlertDialogPrimitive.Cancel> {
  className?: string;
}

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ className, ...props }) => {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
};

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
