
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PagamentoFormValues, PagamentoStatus } from "../types/pagamento";

interface StatusSectionProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
}

export function StatusSection({ form, setForm }: StatusSectionProps) {
  return (
    <div>
      <Label htmlFor="status">Status</Label>
      <Select
        value={form.status}
        onValueChange={(value: PagamentoStatus) => setForm({ ...form, status: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="enviado">Enviado</SelectItem>
          <SelectItem value="confirmado">Confirmado</SelectItem>
          <SelectItem value="pago">Pago</SelectItem>
          <SelectItem value="atrasado">Atrasado</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
