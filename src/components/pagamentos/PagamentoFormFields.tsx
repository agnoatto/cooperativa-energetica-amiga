
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";

interface PagamentoFormFieldsProps {
  form: {
    geracao_kwh: number;
    status: string;
    tusd_fio_b: number;
    valor_concessionaria: number;
  };
  setForm: (form: any) => void;
  valorKwh: number;
  valorBruto: number;
  valorEfetivo: number;
}

export function PagamentoFormFields({
  form,
  setForm,
  valorKwh,
  valorBruto,
  valorEfetivo,
}: PagamentoFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="geracao_kwh">Geração (kWh)</Label>
        <Input
          id="geracao_kwh"
          type="number"
          value={form.geracao_kwh}
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
      <div>
        <Label htmlFor="tusd_fio_b">TUSD Fio B (R$)</Label>
        <CurrencyInput
          id="tusd_fio_b"
          value={form.tusd_fio_b}
          onChange={(value) => {
            const numericValue = Number(value.replace(/[^\d,]/g, '').replace(',', '.'));
            setForm({ ...form, tusd_fio_b: numericValue });
          }}
        />
      </div>
      <div>
        <Label htmlFor="valor_bruto">Valor Bruto (R$)</Label>
        <Input
          id="valor_bruto"
          type="text"
          value={valorBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="valor_concessionaria">Valor Fatura Concessionária (R$)</Label>
        <CurrencyInput
          id="valor_concessionaria"
          value={form.valor_concessionaria}
          onChange={(value) => {
            const numericValue = Number(value.replace(/[^\d,]/g, '').replace(',', '.'));
            setForm({ ...form, valor_concessionaria: numericValue });
          }}
        />
      </div>
      <div>
        <Label htmlFor="valor_efetivo">Valor Efetivo a Receber (R$)</Label>
        <Input
          id="valor_efetivo"
          type="text"
          value={valorEfetivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => setForm({ ...form, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
