
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUploadSection } from "./FileUploadSection";

interface FaturaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  faturaId: string;
  arquivoConcessionariaPath?: string | null;
  arquivoConcessionariaNome?: string | null;
  onUpdateList: () => void;
}

export function FaturaUploadModal({
  isOpen,
  onClose,
  faturaId,
  arquivoConcessionariaPath,
  arquivoConcessionariaNome,
  onUpdateList,
}: FaturaUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!isUploading && !open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          if (isUploading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Enviar Fatura</DialogTitle>
        </DialogHeader>
        <FileUploadSection
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          faturaId={faturaId}
          arquivoConcessionariaPath={arquivoConcessionariaPath}
          arquivoConcessionariaNome={arquivoConcessionariaNome}
          onFileUploaded={onClose}
          onUpdateList={onUpdateList}
        />
      </DialogContent>
    </Dialog>
  );
}
