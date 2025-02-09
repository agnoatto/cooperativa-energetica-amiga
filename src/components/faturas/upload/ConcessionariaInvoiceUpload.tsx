
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
    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecione um arquivo PDF');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo para enviar');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${faturaId}_${Date.now()}.${fileExt}`;

      // Simular progresso durante upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('faturas-concessionaria')
        .upload(filePath, selectedFile, {
          contentType: 'application/pdf',
          upsert: false
        });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setUploadProgress(100);
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
    <Dialog open={isOpen} onOpenChange={(open) => !isUploading && !open && onClose()}>
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
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? "Enviando..." : "Enviar"}
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
