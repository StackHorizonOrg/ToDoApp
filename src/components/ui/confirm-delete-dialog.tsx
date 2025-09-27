import { Button } from "./button";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "./dialog";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  // Se true, il titolo è presente ma nascosto visivamente (accessibile)
  hideTitle?: boolean;
};

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title = "Conferma eliminazione",
  description = "Sei sicuro di voler eliminare questo cliente? L'operazione non può essere annullata.",
  hideTitle = false,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={next => {
        if (!next) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-md md:max-w-lg"
        title={title}
        description={description}
        visuallyHiddenTitle={hideTitle}
      >
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Annulla
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Elimina
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
