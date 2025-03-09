
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { PagamentoFormValues } from "../types/pagamento";
import { ContaEnergiaUpload } from "../upload/ContaEnergiaUpload";
import { useFileState } from "../hooks/useFileState";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";
import { STORAGE_BUCKET } from "../hooks/constants";

interface FileUploadSectionProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
  pagamentoId: string;
}

export function FileUploadSection({ form, setForm, pagamentoId }: FileUploadSectionProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const {
    isUploading,
    pdfUrl,
    setPdfUrl,
    handleFileUpload,
    handleRemoveFile,
    handlePreview
  } = useFileState({ pagamentoId, form, setForm });

  const handleViewFile = async () => {
    if (!form.arquivo_conta_energia_path) {
      return;
    }
    
    try {
      console.log("[FileUploadSection] Tentando visualizar arquivo:", form.arquivo_conta_energia_path);
      console.log("[FileUploadSection] Bucket utilizado:", STORAGE_BUCKET);
      
      const url = await handlePreview();
      if (url) {
        console.log("[FileUploadSection] URL para preview gerada:", url);
        setShowPdfPreview(true);
      }
    } catch (error) {
      console.error("[FileUploadSection] Erro ao gerar preview:", error);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Conta de Energia</Label>
      <ContaEnergiaUpload
        pagamentoId={pagamentoId}
        arquivoNome={form.arquivo_conta_energia_nome}
        arquivoPath={form.arquivo_conta_energia_path}
        isUploading={isUploading}
        onUpload={handleFileUpload}
        onRemove={handleRemoveFile}
        onPreview={handleViewFile}
      />
      {!form.arquivo_conta_energia_nome && (
        <p className="text-sm text-muted-foreground">
          Faça upload da conta de energia em formato PDF (máx. 10MB)
        </p>
      )}

      <PdfPreview
        isOpen={showPdfPreview}
        onClose={() => {
          console.log("[FileUploadSection] Fechando preview PDF");
          setShowPdfPreview(false);
          setPdfUrl(null);
        }}
        pdfUrl={pdfUrl}
        title="Conta de Energia"
        bucketName={STORAGE_BUCKET} // Passando o nome do bucket explicitamente
      />
    </div>
  );
}
