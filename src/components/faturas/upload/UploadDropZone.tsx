
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

interface UploadDropZoneProps {
  isUploading: boolean;
  isDragging: boolean;
  onDrop: (file: File) => void;
}

export function UploadDropZone({ isUploading, isDragging, onDrop }: UploadDropZoneProps) {
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      onDrop(file);
    }
  }, [onDrop]);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-gray-300 hover:border-primary"
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-gray-400"}`} />
        <div className="text-sm text-gray-600">
          {isUploading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando arquivo...
            </span>
          ) : (
            <>
              <span className="font-medium">Arraste e solte aqui</span> ou clique para selecionar
            </>
          )}
        </div>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onDrop(e.target.files[0])}
          onClick={(e) => (e.currentTarget.value = '')}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={isUploading}
        >
          Selecionar arquivo
        </Button>
      </div>
    </div>
  );
}
