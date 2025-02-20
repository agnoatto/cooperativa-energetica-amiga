
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

interface UploadDropZoneProps {
  isUploading: boolean;
  isDragging: boolean;
  onDrop: (file: File) => void;
  onDragStateChange: (isDragging: boolean) => void;
}

export function UploadDropZone({ 
  isUploading, 
  isDragging, 
  onDrop,
  onDragStateChange 
}: UploadDropZoneProps) {
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDragStateChange(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      onDrop(file);
    }
  }, [onDrop, onDragStateChange]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDragStateChange(true);
  }, [onDragStateChange]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDragStateChange(false);
  }, [onDragStateChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onDrop(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        isDragging
          ? "border-primary bg-primary/10"
          : isUploading
          ? "border-primary/50"
          : "border-gray-300 hover:border-primary"
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <Upload 
          className={`h-10 w-10 ${
            isDragging 
              ? "text-primary" 
              : isUploading 
              ? "text-primary/50"
              : "text-gray-400"
          }`} 
        />
        <div className="text-sm text-gray-600">
          {isUploading ? (
            <span className="flex items-center gap-2 text-primary/80">
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando arquivo...
            </span>
          ) : (
            <>
              <span className="font-medium">
                {isDragging ? 'Solte o arquivo aqui' : 'Arraste e solte aqui'}
              </span>
              <br />
              ou clique para selecionar
            </>
          )}
        </div>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileSelect}
          onClick={(e) => (e.currentTarget.value = '')}
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={isUploading}
          className="relative"
        >
          Selecionar arquivo
          {isUploading && (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          )}
        </Button>
      </div>
    </div>
  );
}
