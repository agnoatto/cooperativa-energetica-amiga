
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

      // Create FormData with the file
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Create XHR request to track progress
      const xhr = new XMLHttpRequest();
      
      // Create a Promise to handle the XHR upload
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percentage));
          }
        });

        xhr.addEventListener('load', async () => {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });
      });

      // Get the pre-signed URL for upload
      const { data: { signedUrl } } = await supabase.storage
        .from('faturas-concessionaria')
        .createSignedUploadUrl(filePath);

      if (!signedUrl) {
        throw new Error('Failed to get upload URL');
      }

      // Configure and send XHR request
      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', 'application/pdf');
      xhr.send(selectedFile);

      // Wait for upload to complete
      await uploadPromise;

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
