
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function UploadDropzone({ onFileSelect, isUploading }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Arraste e solte o arquivo PDF da fatura aqui ou
        </p>
        <label className="mt-2 inline-block">
          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <Button
            variant="outline"
            className="mt-2"
            disabled={isUploading}
          >
            Selecione um arquivo
          </Button>
        </label>
      </div>
      <p className="text-xs text-gray-500">
        Somente arquivos PDF são aceitos
      </p>
    </div>
  );
}
