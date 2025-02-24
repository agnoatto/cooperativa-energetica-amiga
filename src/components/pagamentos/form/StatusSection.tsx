
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PagamentoFormValues, PagamentoStatus } from "../types/pagamento";

interface StatusSectionProps {
  form: PagamentoFormValues;
}

export function StatusSection({ form }: StatusSectionProps) {
  return (
    <div>
      <Label>Status</Label>
      <div className="mt-2">
        <Badge variant={getBadgeVariant(form.status)}>{getStatusLabel(form.status)}</Badge>
      </div>
    </div>
  );
}

function getBadgeVariant(status: PagamentoStatus) {
  switch (status) {
    case 'pendente':
      return 'outline';
    case 'enviado':
      return 'default';
    case 'pago':
      return 'default';
    case 'atrasado':
      return 'destructive';
    case 'cancelado':
      return 'secondary';
    default:
      return 'outline';
  }
}

function getStatusLabel(status: PagamentoStatus) {
  switch (status) {
    case 'pendente':
      return 'Pendente';
    case 'enviado':
      return 'Enviado';
    case 'pago':
      return 'Pago';
    case 'atrasado':
      return 'Atrasado';
    case 'cancelado':
      return 'Cancelado';
    default:
      return 'Pendente';
  }
}
