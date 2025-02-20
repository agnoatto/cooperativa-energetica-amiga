
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PagamentoFormValues } from "../types/pagamento";

interface GeracaoSectionProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
  valorKwh: number;
}

export function GeracaoSection({ form, setForm, valorKwh }: GeracaoSectionProps) {
  return (
    <>
      <div>
        <Label htmlFor="geracao_kwh">Geração (kWh)</Label>
        <Input
          id="geracao_kwh"
          type="number"
          value={form.geracao_kwh || ''}
          onChange={(e) => setForm({ ...form, geracao_kwh: e.target.valueAsNumber || 0 })}
        />
      </div>

      <div>
        <Label htmlFor="valor_kwh">Valor do kWh (R$)</Label>
        <Input
          id="valor_kwh"
          type="text"
          value={valorKwh.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          })}
          disabled
          className="bg-gray-100"
        />
      </div>
    </>
  );
}
