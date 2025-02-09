
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "../CurrencyInput";
import type { FaturaFormFieldProps } from "../types/fatura-form";

interface ValoresFieldsProps {
  totalFatura: FaturaFormFieldProps;
  faturaConcessionaria: FaturaFormFieldProps;
  iluminacaoPublica: FaturaFormFieldProps;
  outrosValores: FaturaFormFieldProps;
}

export function ValoresFields({ 
  totalFatura,
  faturaConcessionaria,
  iluminacaoPublica,
  outrosValores 
}: ValoresFieldsProps) {
  return (
    <>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="totalFatura">Valor Total Original</Label>
        <CurrencyInput
          id="totalFatura"
          value={totalFatura.value}
          onChange={totalFatura.onChange}
          required
          disabled={totalFatura.isSubmitting}
        />
      </div>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="faturaConcessionaria">Valor Conta de Energia</Label>
        <CurrencyInput
          id="faturaConcessionaria"
          value={faturaConcessionaria.value}
          onChange={faturaConcessionaria.onChange}
          required
          disabled={faturaConcessionaria.isSubmitting}
        />
      </div>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="iluminacaoPublica">Iluminação Pública</Label>
        <CurrencyInput
          id="iluminacaoPublica"
          value={iluminacaoPublica.value}
          onChange={iluminacaoPublica.onChange}
          required
          disabled={iluminacaoPublica.isSubmitting}
        />
      </div>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="outrosValores">Outros Valores</Label>
        <CurrencyInput
          id="outrosValores"
          value={outrosValores.value}
          onChange={outrosValores.onChange}
          required
          disabled={outrosValores.isSubmitting}
        />
      </div>
    </>
  );
}
