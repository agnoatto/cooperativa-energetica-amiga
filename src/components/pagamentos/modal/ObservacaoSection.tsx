
/**
 * Componente de seção de observações para o formulário de edição de pagamentos
 * 
 * Este componente permite adicionar e editar observações relacionadas ao pagamento
 * que serão exibidas no boletim de medição e em outros relatórios.
 */
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface ObservacaoSectionProps {
  observacao: string;
  setObservacao: (value: string) => void;
}

export function ObservacaoSection({ observacao, setObservacao }: ObservacaoSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="observacao" className="font-medium">
          Observações
        </Label>
      </div>
      <Textarea
        id="observacao"
        placeholder="Observações sobre o pagamento (visíveis no boletim de medição)"
        className="resize-none h-24"
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
      />
    </div>
  );
}
