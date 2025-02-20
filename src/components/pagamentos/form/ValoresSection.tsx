
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";
import { PagamentoFormValues } from "../types/pagamento";

interface ValoresSectionProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
  valorBruto: number;
  valorEfetivo: number;
  valorTotalTusdFioB: number;
}

export function ValoresSection({ form, setForm, valorBruto, valorEfetivo, valorTotalTusdFioB }: ValoresSectionProps) {
  return (
    <>
      <div>
        <Label htmlFor="tusd_fio_b">TUSD Fio B (R$/kWh)</Label>
        <CurrencyInput
          id="tusd_fio_b"
          value={form.tusd_fio_b.toString()}
          onChange={(value) => setForm({ ...form, tusd_fio_b: parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0 })}
        />
      </div>

      <div>
        <Label htmlFor="valor_total_tusd">Valor Total TUSD Fio B (R$)</Label>
        <Input
          id="valor_total_tusd"
          type="text"
          value={valorTotalTusdFioB.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
          disabled
          className="bg-gray-100"
        />
      </div>

      <div>
        <Label htmlFor="valor_bruto">Valor Bruto (R$)</Label>
        <Input
          id="valor_bruto"
          type="text"
          value={valorBruto.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
          disabled
          className="bg-gray-100"
        />
      </div>

      <div>
        <Label htmlFor="valor_efetivo">Valor Efetivo a Receber (R$)</Label>
        <Input
          id="valor_efetivo"
          type="text"
          value={valorEfetivo.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
          disabled
          className="bg-gray-100"
        />
      </div>
    </>
  );
}
