
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { handleFileUpload, downloadFile } from "./utils/fileHandlers";

interface FileUploadSectionProps {
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  faturaId: string;
  arquivoConcessionariaPath?: string | null;
  arquivoConcessionariaNome?: string | null;
  onSuccess: () => void;
}

export function FileUploadSection({
  isUploading,
  setIsUploading,
  faturaId,
  arquivoConcessionariaPath,
  arquivoConcessionariaNome,
  onSuccess
}: FileUploadSectionProps) {
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await handleFileUpload(file, faturaId, onSuccess);
    setIsUploading(false);
  };

  return (
    <div className="grid w-full items-center gap-2">
      <Label>Arquivo da Fatura</Label>
      <div className="flex gap-2">
        <Input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          disabled={isUploading}
          className="flex-1"
        />
        {arquivoConcessionariaPath && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => downloadFile(arquivoConcessionariaPath, arquivoConcessionariaNome)}
            title="Baixar arquivo"
          >
            <Upload className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isUploading && <p className="text-sm text-muted-foreground">Enviando arquivo...</p>}
    </div>
  );
}
