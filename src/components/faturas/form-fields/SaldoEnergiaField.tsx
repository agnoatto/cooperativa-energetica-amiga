
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FaturaFormFieldProps } from "../types/fatura-form";

export function SaldoEnergiaField({ value, onChange, isSubmitting }: FaturaFormFieldProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="saldoEnergiaKwh">Saldo de Energia (kWh)</Label>
      <Input
        type="number"
        id="saldoEnergiaKwh"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step="0.01"
        min="0"
        required
        disabled={isSubmitting}
      />
    </div>
  );
}
