
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { handleFileUpload, downloadFile } from "./utils/fileHandlers";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FileUploadSectionProps } from "./types";

export function FileUploadSection({
  isUploading,
  setIsUploading,
  faturaId,
  arquivoConcessionariaPath,
  arquivoConcessionariaNome,
  onFileUploaded
}: FileUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    await handleFileUpload(file, faturaId, onFileUploaded);
    setIsUploading(false);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="grid w-full items-center gap-2">
      <Label>Arquivo da Fatura</Label>
      <div className="flex gap-2">
        <div 
          className={cn(
            "relative flex-1 rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors",
            isDragging && "border-primary bg-primary/5",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-6 w-6" />
            <p>Arraste o PDF aqui ou clique para selecionar</p>
            {isUploading && <p>Enviando arquivo...</p>}
          </div>
        </div>
        {arquivoConcessionariaPath && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(arquivoConcessionariaPath, arquivoConcessionariaNome);
            }}
            title="Baixar arquivo"
          >
            <Upload className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
