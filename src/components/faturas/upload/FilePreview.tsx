
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FilePreviewProps {
  fileName: string;
  onPreview: () => void;
  onDownload: () => void;
  onRemove: () => void;
  className?: string;
}

export function FilePreview({ 
  fileName, 
  onPreview, 
  onDownload, 
  onRemove,
  className 
}: FilePreviewProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onRemove();
  };

  return (
    <>
      <div className={cn("flex items-center gap-2 p-2 rounded-md", className)}>
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-sm truncate">{fileName}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onPreview}
          className="h-8 w-8"
          title="Visualizar arquivo"
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDownload}
          className="h-8 w-8"
          title="Baixar arquivo"
        >
          <FileUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteDialog(true)}
          className="h-8 w-8"
          title="Remover arquivo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este arquivo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
