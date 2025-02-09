
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FaturaFormFieldProps } from "../types/fatura-form";

export function DataVencimentoField({ value, onChange, isSubmitting }: FaturaFormFieldProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="dataVencimento">Data de Vencimento</Label>
      <Input
        type="date"
        id="dataVencimento"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={isSubmitting}
      />
    </div>
  );
}
