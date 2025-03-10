
import React, { useCallback, useState } from "react";
import { FileText, Upload, X, DownloadCloud, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "./useFileUpload";
import { formatFileSize } from "@/utils/formatters";
import { FaturaStatus } from "@/types/fatura";

interface FaturaUploadAreaProps {
  faturaId: string;
  initialFile?: {
    nome: string | null;
    path: string | null;
    tipo: string | null;
    tamanho: number | null;
  };
  onFileChange?: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  onStatusUpdate?: (newStatus: FaturaStatus) => void; // Novo: callback para atualização de status
  refetchFaturas?: () => void;
}

export function FaturaUploadArea({ 
  faturaId, 
  initialFile, 
  onFileChange,
  onStatusUpdate,
  refetchFaturas 
}: FaturaUploadAreaProps) {
  const [fileName, setFileName] = useState<string | null>(initialFile?.nome || null);
  const [filePath, setFilePath] = useState<string | null>(initialFile?.path || null);
  const [fileType, setFileType] = useState<string | null>(initialFile?.tipo || null);
  const [fileSize, setFileSize] = useState<number | null>(initialFile?.tamanho || null);

  // Uso do hook useFileUpload com callbacks para atualizar o estado local
  const { 
    isUploading, 
    isDragging, 
    showPdfPreview,
    setIsDragging, 
    setShowPdfPreview,
    handleFileUpload,
    handleDownload,
    handleRemoveFile,
    handlePreview
  } = useFileUpload(faturaId, {
    onFileChange: (nome, path, tipo, tamanho) => {
      // Atualizar estado local
      setFileName(nome);
      setFilePath(path);
      setFileType(tipo);
      setFileSize(tamanho);
      
      // Propagar para o componente pai
      if (onFileChange) {
        onFileChange(nome, path, tipo, tamanho);
      }
    },
    refetchFaturas,
    onStatusUpdate // Novo: passar o callback de atualização de status
  });

  // Controladores de eventos para o upload de arquivos
  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        handleFileUpload(Array.from(files));
      }
    };
    input.click();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
  
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(Array.from(e.dataTransfer.files));
      }
    },
    [handleFileUpload, setIsDragging]
  );
  
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    },
    [setIsDragging]
  );
  
  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    },
    [setIsDragging]
  );

  // Conteúdo a ser renderizado com base no estado do arquivo
  const renderContent = () => {
    if (isUploading) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="animate-pulse text-blue-500">
            <Upload className="h-10 w-10 mb-2" />
          </div>
          <p className="text-sm text-gray-500">Enviando arquivo...</p>
        </div>
      );
    }

    if (filePath && fileName) {
      return (
        <div className="bg-gray-50 rounded p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-500 h-8 w-8" />
            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate" title={fileName}>
                {fileName}
              </p>
              {fileSize && (
                <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              title="Visualizar"
              onClick={() => filePath && handlePreview(filePath)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Baixar"
              onClick={() => filePath && handleDownload(filePath, fileName || 'fatura.pdf')}
            >
              <DownloadCloud className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Remover"
              onClick={() => filePath && handleRemoveFile(filePath, faturaId)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        onClick={handleUploadClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <div>
            <p className="text-sm font-medium">
              {isDragging ? 'Solte o arquivo aqui' : 'Clique ou arraste para enviar'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Apenas arquivos PDF</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
}
