import { Button, Dialog } from "@/components";
import { ButtonProps } from "@/components/ui/Button/Button";
import { ReactNode } from "react";

interface Props {
  title: ReactNode;
  description: ReactNode;

  confirmButtonText?: string;
  confirmButtonVariant?: ButtonProps["variant"];

  open: boolean;

  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  title,
  description,
  confirmButtonText = "Delete",
  confirmButtonVariant = "destructive",

  open,

  onConfirm,
  onClose,
}: Props): JSX.Element => {
  return (
    <Dialog.root open={open} onOpenChange={onClose}>
      <Dialog.content className="sm:max-w-[425px]">
        <Dialog.header>
          <Dialog.title>{title}</Dialog.title>
          <Dialog.description>{description}</Dialog.description>
        </Dialog.header>

        <Dialog.footer className="mt-2">
          <Button
            onClick={() => onClose()}
            variant="outline"
            width="full"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm()}
            variant={confirmButtonVariant}
            width="full"
            size="sm"
          >
            {confirmButtonText}
          </Button>
        </Dialog.footer>
      </Dialog.content>
    </Dialog.root>
  );
};
