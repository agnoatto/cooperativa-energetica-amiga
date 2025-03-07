
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ObservacaoSectionProps {
  observacao: string;
  setObservacao: (value: string) => void;
}

export function ObservacaoSection({ observacao, setObservacao }: ObservacaoSectionProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="observacao">Observações</Label>
      <Textarea
        id="observacao"
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
        placeholder="Adicione observações relevantes sobre a fatura..."
        className="resize-none"
        rows={3}
      />
    </div>
  );
}
