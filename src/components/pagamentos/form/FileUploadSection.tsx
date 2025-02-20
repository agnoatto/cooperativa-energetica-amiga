
import { Label } from "@/components/ui/label";
import { PagamentoFormValues, PagamentoStatus } from "../types/pagamento";
import { PaymentFileUpload } from "../upload/PaymentFileUpload";

interface FileUploadSectionProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
  pagamentoId: string;
}

export function FileUploadSection({ form, setForm, pagamentoId }: FileUploadSectionProps) {
  return (
    <div>
      <Label>Comprovante de Pagamento</Label>
      <PaymentFileUpload
        pagamentoId={pagamentoId}
        arquivoNome={form.arquivo_comprovante_nome}
        arquivoPath={form.arquivo_comprovante_path}
        onSuccess={() => {
          setForm({
            ...form,
            status: 'pendente' as PagamentoStatus
          });
        }}
        onFileChange={() => {
          // Notificar sobre a mudança do arquivo
        }}
      />
    </div>
  );
}
