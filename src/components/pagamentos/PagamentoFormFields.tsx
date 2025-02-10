
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PagamentoFormFieldsProps {
  form: any;
  setForm: (form: any) => void;
  valorKwh: number;
  valorBruto: number;
}

export function PagamentoFormFields({
  form,
  setForm,
  valorKwh,
  valorBruto,
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
