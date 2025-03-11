
/**
 * Modal para edição de pagamentos de usinas
 * 
 * Este componente permite a visualização e edição dos dados de um pagamento
 * de usina, incluindo informações de geração, valores e datas.
 */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PagamentoData } from "./types/pagamento";
import { usePagamentoForm } from "./hooks/usePagamentoForm";
import { PagamentoFormFields } from "./PagamentoFormFields";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface PagamentoEditModalProps {
  pagamento: PagamentoData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function PagamentoEditModal({
  pagamento,
  isOpen,
  onClose,
  onSave,
}: PagamentoEditModalProps) {
  const {
    form,
    setForm,
    valorKwh,
    valorBruto,
    valorTotalTusdFioB,
    valorEfetivo,
    handleSubmit,
  } = usePagamentoForm(pagamento, onSave, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {pagamento ? 'Editar Pagamento' : 'Novo Pagamento'}
          </DialogTitle>
        </DialogHeader>

        {pagamento && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Investidor</p>
              <p className="font-medium">{pagamento.usina?.investidor?.nome_investidor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nº UC</p>
              <p className="font-medium">{pagamento.usina?.unidade_usina?.numero_uc}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor kWh</p>
              <p className="font-medium">{formatarMoeda(pagamento.usina?.valor_kwh || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Geração Total</p>
              <p className="font-medium">{pagamento.geracao_kwh} kWh</p>
            </div>
            <div className="col-span-2 md:col-span-4">
              <p className="text-sm text-muted-foreground">Período</p>
              <p className="font-medium">
                {format(new Date(pagamento.ano, pagamento.mes - 1), "MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <PagamentoFormFields
            form={form}
            setForm={setForm}
            valorKwh={valorKwh}
            valorBruto={valorBruto}
            valorTotalTusdFioB={valorTotalTusdFioB}
            valorEfetivo={valorEfetivo}
            pagamentoId={pagamento?.id || ''}
          />
          
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
