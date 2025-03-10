
/**
 * Componente para exibição e interação com arquivos anexados
 * 
 * Este componente mostra informações do arquivo anexado e oferece
 * opções para visualização e remoção do arquivo.
 */
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { formatFileSize } from "@/utils/formatters";

interface FilePreviewProps {
  fileName: string;
  fileSize: number | null;
  fileType: string | null;
  onView: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

export function FilePreview({
  fileName,
  fileSize,
  fileType,
  onView,
  onDelete,
  isLoading
}: FilePreviewProps) {
  // Função para manipular a visualização sem propagar o evento
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impedir que o evento se propague
    e.preventDefault(); // Prevenir comportamento padrão
    onView();
  };
  
  // Função para manipular a exclusão sem propagar o evento
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impedir que o evento se propague
    e.preventDefault(); // Prevenir comportamento padrão
    onDelete();
  };
  
  return (
    <div className="bg-gray-50 border rounded-md p-3 flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={fileName}>
          {fileName}
        </p>
        <p className="text-xs text-gray-500">
          {fileSize ? formatFileSize(fileSize) : 'Tamanho desconhecido'} • 
          {fileType ? fileType.split('/')[1].toUpperCase() : 'Tipo desconhecido'}
        </p>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={handleView}
          disabled={isLoading}
        >
          <Eye className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Ver</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-500"
          onClick={handleDelete}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Excluir</span>
        </Button>
      </div>
    </div>
  );
}
