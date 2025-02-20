
import { Label } from "@/components/ui/label";
import { PagamentoFormValues, PagamentoStatus } from "../types/pagamento";
import { ContaEnergiaUpload } from "../upload/ContaEnergiaUpload";

interface FileUploadSectionProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
  pagamentoId: string;
}

export function FileUploadSection({ form, setForm, pagamentoId }: FileUploadSectionProps) {
  const handleSuccess = () => {
    // Atualizar o status para pendente apenas se não houver status
    if (!form.status) {
      setForm({
        ...form,
        status: 'pendente' as PagamentoStatus
      });
    }
  };

  const handleFileChange = () => {
    // Recarregar os dados do pagamento após alteração no arquivo
    console.log('[FileUploadSection] Arquivo alterado, atualizando formulário');
  };

  return (
    <div className="space-y-2">
      <Label>Conta de Energia</Label>
      <ContaEnergiaUpload
        pagamentoId={pagamentoId}
        arquivoNome={form.arquivo_conta_energia_nome}
        arquivoPath={form.arquivo_conta_energia_path}
        onSuccess={handleSuccess}
        onFileChange={handleFileChange}
      />
      {!form.arquivo_conta_energia_nome && (
        <p className="text-sm text-muted-foreground">
          Faça upload da conta de energia em formato PDF (máx. 10MB)
        </p>
      )}
    </div>
  );
}
