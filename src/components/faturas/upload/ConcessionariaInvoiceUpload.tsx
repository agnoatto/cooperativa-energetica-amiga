
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "./UploadDropzone";
import { UploadProgress } from "./UploadProgress";
import { supabase } from "@/integrations/supabase/client";
import { File } from "lucide-react";
import { toast } from "sonner";

interface ConcessionariaInvoiceUploadProps {
  isOpen: boolean;
  onClose: () => void;
  faturaId: string;
  onSuccess: (filePath: string) => Promise<void>;
}

export function ConcessionariaInvoiceUpload({
  isOpen,
  onClose,
  faturaId,
  onSuccess,
}: ConcessionariaInvoiceUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${faturaId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('faturas-concessionaria')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true,
          onProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percentage));
          },
        });

      if (uploadError) throw uploadError;

      await onSuccess(filePath);
      toast.success('Arquivo enviado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao enviar arquivo. Tente novamente.');
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Fatura da Concessionária</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isUploading ? (
            <>
              <UploadDropzone
                onFileSelect={handleFileSelect}
                isUploading={isUploading}
              />
              {selectedFile && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <File className="w-4 h-4" />
                  <span className="text-sm">{selectedFile.name}</span>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  Enviar
                </Button>
              </div>
            </>
          ) : (
            <UploadProgress
              progress={uploadProgress}
              fileName={selectedFile?.name || ''}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
