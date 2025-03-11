
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PagamentoFormValues, PagamentoStatus } from "../types/pagamento";

interface StatusSectionProps {
  form: PagamentoFormValues;
  setForm?: (form: PagamentoFormValues) => void;
}

// Mapeamento de status para transições permitidas
const ALLOWED_TRANSITIONS: Record<PagamentoStatus, PagamentoStatus[]> = {
  pendente: ['pendente', 'enviado', 'cancelado'],
  enviado: ['enviado', 'pago', 'atrasado', 'cancelado'],
  pago: ['pago', 'cancelado'],
  atrasado: ['atrasado', 'pago', 'cancelado'],
  cancelado: ['cancelado']
};

export function StatusSection({ form, setForm }: StatusSectionProps) {
  const [error, setError] = useState<string | null>(null);

  // Se não tiver setForm, apenas mostra o status atual
  if (!setForm) {
    return (
      <div>
        <Label>Status</Label>
        <div className="mt-2">
          <Badge variant={getBadgeVariant(form.status)}>{getStatusLabel(form.status)}</Badge>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: PagamentoStatus) => {
    // Verificar se a transição é permitida
    if (form.status && !ALLOWED_TRANSITIONS[form.status].includes(newStatus)) {
      setError(`Não é permitido mudar de ${getStatusLabel(form.status)} para ${getStatusLabel(newStatus)}`);
      return;
    }

    setError(null);
    setForm({ ...form, status: newStatus });
  };

  return (
    <div className="space-y-2">
      <Label>Status</Label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Select 
        value={form.status || undefined} 
        onValueChange={(value) => handleStatusChange(value as PagamentoStatus)}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {form.status ? getStatusLabel(form.status) : 'Selecione um status'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {form.status && ALLOWED_TRANSITIONS[form.status].map((status) => (
            <SelectItem key={status} value={status}>
              <div className="flex items-center gap-2">
                <Badge variant={getBadgeVariant(status)} className="px-2 py-0.5 text-xs">
                  {getStatusLabel(status)}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        {getStatusDescription(form.status)}
      </p>
    </div>
  );
}

function getBadgeVariant(status: PagamentoStatus | null) {
  if (!status) return 'outline';
  
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

function getStatusLabel(status: PagamentoStatus | null) {
  if (!status) return 'Não definido';
  
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
      return 'Não definido';
  }
}

function getStatusDescription(status: PagamentoStatus | null) {
  if (!status) return '';
  
  switch (status) {
    case 'pendente':
      return 'Pagamento aguardando processamento.';
    case 'enviado':
      return 'Boletim enviado ao investidor.';
    case 'pago':
      return 'Pagamento recebido e confirmado.';
    case 'atrasado':
      return 'Pagamento não realizado até a data de vencimento.';
    case 'cancelado':
      return 'Pagamento cancelado e não será processado.';
    default:
      return '';
  }
}
