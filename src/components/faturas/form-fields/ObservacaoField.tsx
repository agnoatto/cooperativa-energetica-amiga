
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FaturaFormFieldProps } from "../types/fatura-form";

export function ObservacaoField({ value, onChange, isSubmitting }: FaturaFormFieldProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="observacao">Observações</Label>
      <Textarea
        id="observacao"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Adicione observações relevantes sobre a fatura..."
        className="resize-none"
        rows={3}
        disabled={isSubmitting}
      />
    </div>
  );
}
