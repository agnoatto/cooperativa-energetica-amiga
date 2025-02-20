
import { Label } from "@/components/ui/label";
import { PagamentoFormValues, PagamentoStatus } from "../types/pagamento";
import { PaymentFileUpload } from "../upload/PaymentFileUpload";

interface FileUploadSectionProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
  pagamentoId: string;
}

export function FileUploadSection({ form, setForm, pagamentoId }: FileUploadSectionProps) {
  const handleSuccess = () => {
    // Atualizar o status para pendente apenas se não houver status ou se for rascunho
    if (!form.status || form.status === 'draft') {
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
      <Label>Comprovante de Pagamento</Label>
      <PaymentFileUpload
        pagamentoId={pagamentoId}
        arquivoNome={form.arquivo_comprovante_nome}
        arquivoPath={form.arquivo_comprovante_path}
        onSuccess={handleSuccess}
        onFileChange={handleFileChange}
      />
      {!form.arquivo_comprovante_nome && (
        <p className="text-sm text-muted-foreground">
          Faça upload do comprovante de pagamento em formato PDF (máx. 10MB)
        </p>
      )}
    </div>
  );
}
