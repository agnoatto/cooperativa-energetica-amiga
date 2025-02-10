
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";

interface PagamentoFormFieldsProps {
  form: any;
  setForm: (form: any) => void;
  valorKwh: number;
  valorKwhEfetivo: number;
  valorBruto: number;
  parseCurrencyToNumber: (value: string) => number;
}

export function PagamentoFormFields({
  form,
  setForm,
  valorKwh,
  valorKwhEfetivo,
  valorBruto,
  parseCurrencyToNumber
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
            minimumFractionDigits: 4, 
            maximumFractionDigits: 4,
            useGrouping: true
          })}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="valor_tusd_fio_b">TUSD Fio B (R$/kWh)</Label>
        <CurrencyInput
          id="valor_tusd_fio_b"
          value={form.valor_tusd_fio_b}
          onChange={(value) => setForm({ ...form, valor_tusd_fio_b: parseCurrencyToNumber(value) })}
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="valor_kwh_efetivo">Valor kWh Efetivo (R$)</Label>
        <Input
          id="valor_kwh_efetivo"
          type="text"
          value={valorKwhEfetivo.toLocaleString('pt-BR', { 
            minimumFractionDigits: 4, 
            maximumFractionDigits: 4,
            useGrouping: true
          })}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="valor_bruto">Valor Bruto a Receber (R$)</Label>
        <Input
          id="valor_bruto"
          type="text"
          value={valorBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="conta_energia">Conta de Energia (R$)</Label>
        <CurrencyInput
          id="conta_energia"
          value={form.conta_energia}
          onChange={(value) => setForm({ ...form, conta_energia: parseCurrencyToNumber(value) })}
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="valor_total">Valor Total Líquido</Label>
        <CurrencyInput
          id="valor_total"
          value={form.valor_total}
          onChange={() => {}} // Somente leitura
          className="w-full bg-gray-100"
          readOnly
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
