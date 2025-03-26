
/**
 * Componente de entrada de arquivos
 * 
 * Oferece uma interface amigável para upload de arquivos,
 * incluindo suporte para arrastar e soltar e visualização de progresso.
 */
import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileInputProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function FileInput({
  onFileSelected,
  accept = "*",
  disabled = false,
  className,
  placeholder = "Arraste um arquivo ou clique para selecionar",
}: FileInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-input bg-background hover:bg-accent/10",
        disabled && "opacity-50 cursor-not-allowed hover:bg-background",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <UploadCloud
        className={cn(
          "h-10 w-10",
          isDragging ? "text-primary" : "text-muted-foreground"
        )}
      />
      <div className="text-center">
        <p className="text-sm font-medium">{placeholder}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Clique ou arraste e solte
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
}
