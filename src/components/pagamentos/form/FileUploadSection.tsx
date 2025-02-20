
import { Label } from "@/components/ui/label";
import { PagamentoFormValues, PagamentoStatus } from "../types/pagamento";
import { ContaEnergiaUpload } from "../upload/ContaEnergiaUpload";

interface FileUploadSectionProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
  pagamentoId: string;
}

export function FileUploadSection({ form, setForm, pagamentoId }: FileUploadSectionProps) {
  const handleSuccess = (fileName: string, filePath: string) => {
    console.log("[FileUpload] Arquivo enviado com sucesso:", { fileName, filePath });
    setForm({
      ...form,
      status: form.status || 'pendente' as PagamentoStatus,
      arquivo_conta_energia_nome: fileName,
      arquivo_conta_energia_path: filePath
    });
  };

  const handleFileRemoved = () => {
    console.log("[FileUpload] Arquivo removido");
    setForm({
      ...form,
      arquivo_conta_energia_nome: null,
      arquivo_conta_energia_path: null,
      arquivo_conta_energia_tipo: null,
      arquivo_conta_energia_tamanho: null
    });
  };

  return (
    <div className="space-y-2">
      <Label>Conta de Energia</Label>
      <ContaEnergiaUpload
        pagamentoId={pagamentoId}
        arquivoNome={form.arquivo_conta_energia_nome}
        arquivoPath={form.arquivo_conta_energia_path}
        onSuccess={handleSuccess}
        onFileRemoved={handleFileRemoved}
      />
      {!form.arquivo_conta_energia_nome && (
        <p className="text-sm text-muted-foreground">
          Faça upload da conta de energia em formato PDF (máx. 10MB)
        </p>
      )}
    </div>
  );
}
