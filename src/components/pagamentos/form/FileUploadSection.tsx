
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { PagamentoFormValues } from "../types/pagamento";
import { ContaEnergiaUpload } from "../upload/ContaEnergiaUpload";
import { useFileState } from "../hooks/useFileState";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";

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
    const url = await handlePreview();
    if (url) {
      setShowPdfPreview(true);
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
          setShowPdfPreview(false);
          setPdfUrl(null);
        }}
        pdfUrl={pdfUrl}
      />
    </div>
  );
}
