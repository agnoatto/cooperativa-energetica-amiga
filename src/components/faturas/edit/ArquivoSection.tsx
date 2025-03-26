
/**
 * Seção de upload de arquivo no formulário de edição de faturas
 * 
 * Permite upload e visualização do arquivo da concessionária anexado à fatura.
 * Implementa o modo somente leitura quando a fatura está em status que não permite edição.
 */
import { useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { FileInput } from "@/components/ui/file-input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, UploadCloud } from "lucide-react";
import { formatFileSize } from "@/utils/formatters";

interface ArquivoSectionProps {
  faturaId: string;
  arquivoNome: string | null;
  arquivoPath: string | null;
  arquivoTipo: string | null;
  arquivoTamanho: number | null;
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  refetchFaturas?: () => void;
  readOnly?: boolean;
}

export function ArquivoSection({
  faturaId,
  arquivoNome,
  arquivoPath,
  arquivoTipo,
  arquivoTamanho,
  onFileChange,
  refetchFaturas,
  readOnly = false
}: ArquivoSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadFile, deleteFile, getFileUrl } = useFileUpload();

  const handleUpload = async (file: File) => {
    if (!file || readOnly) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const folder = `faturas/${faturaId}`;
      const { path, tipo, nome, tamanho } = await uploadFile(file, folder, (progress) => {
        setUploadProgress(progress);
      });
      
      onFileChange(nome, path, tipo, tamanho);
      if (refetchFaturas) {
        setTimeout(refetchFaturas, 500);
      }
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!arquivoPath || readOnly) return;
    
    try {
      await deleteFile(arquivoPath);
      onFileChange(null, null, null, null);
      if (refetchFaturas) {
        setTimeout(refetchFaturas, 500);
      }
    } catch (error) {
      console.error("Erro ao excluir arquivo:", error);
    }
  };

  const handleView = async () => {
    if (!arquivoPath) return;
    
    try {
      const url = await getFileUrl(arquivoPath);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Erro ao obter URL do arquivo:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Arquivo da Concessionária</h3>
      
      {uploading && (
        <div className="space-y-2">
          <div className="text-sm">Enviando arquivo...</div>
          <Progress value={uploadProgress} />
        </div>
      )}
      
      {!uploading && !arquivoNome && (
        <FileInput 
          onFileSelected={handleUpload} 
          accept=".pdf,.jpg,.jpeg,.png" 
          disabled={readOnly}
        />
      )}
      
      {!uploading && arquivoNome && (
        <div className="border rounded-md p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              <div>
                <p className="font-medium">{arquivoNome}</p>
                <p className="text-sm text-gray-500">
                  {arquivoTamanho ? formatFileSize(arquivoTamanho) : ""}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleView}
              >
                <FileText className="h-4 w-4 mr-1" />
                Ver
              </Button>
              
              {!readOnly && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              )}
            </div>
          </div>
          
          {!readOnly && (
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-1" />
                Substituir Arquivo
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
