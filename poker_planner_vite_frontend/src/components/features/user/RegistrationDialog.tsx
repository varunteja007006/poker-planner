import React from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Registration from "./Registration";

export default function RegistrationDialog({
  defaultOpen = false,
}: Readonly<{
  defaultOpen?: boolean;
}>) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  const onSuccess = () => setOpen(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader className="sr-only">
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <Registration onSuccess={onSuccess} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
