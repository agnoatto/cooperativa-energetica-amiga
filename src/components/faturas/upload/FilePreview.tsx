
import { Button } from "@/components/ui/button";
import { FileText, FileUp, Trash2 } from "lucide-react";

interface FilePreviewProps {
  fileName: string;
  onPreview: () => void;
  onDownload: () => void;
  onRemove: () => void;
}

export function FilePreview({ 
  fileName, 
  onPreview, 
  onDownload, 
  onRemove 
}: FilePreviewProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
      <FileText className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1 text-sm truncate">{fileName}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onPreview}
        className="h-8 w-8"
        title="Visualizar arquivo"
      >
        <FileText className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDownload}
        className="h-8 w-8"
        title="Baixar arquivo"
      >
        <FileUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8"
        title="Remover arquivo"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
