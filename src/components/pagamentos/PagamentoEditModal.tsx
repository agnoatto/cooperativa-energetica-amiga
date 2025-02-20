
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePagamentoForm } from "./hooks/usePagamentoForm";
import { PagamentoFormFields } from "./PagamentoFormFields";
import { PagamentoData } from "./types/pagamento";
import { Card, CardContent } from "@/components/ui/card";

interface PagamentoEditModalProps {
  pagamento: PagamentoData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const mesesDoAno = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function PagamentoEditModal({ pagamento, isOpen, onClose, onSave }: PagamentoEditModalProps) {
  const {
    form,
    setForm,
    valorKwh,
    valorBruto,
    valorEfetivo,
    valorTotalTusdFioB,
    handleSubmit,
  } = usePagamentoForm(pagamento, onSave, onClose);

  if (!pagamento) return null;

  const nomeMes = mesesDoAno[pagamento.mes - 1];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Pagamento - {nomeMes}/{pagamento.ano}</DialogTitle>
        </DialogHeader>

        <Card className="bg-muted mb-4">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Dados da Usina</h4>
                <div className="text-sm space-y-1">
                  <p>UC: {pagamento.usina.unidade_usina.numero_uc}</p>
                  <p>Valor kWh: R$ {valorKwh.toFixed(4)}</p>
                  <p>Previsão de Geração: {form.geracao_kwh.toLocaleString('pt-BR')} kWh</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dados do Investidor</h4>
                <div className="text-sm space-y-1">
                  <p>Nome: {pagamento.usina.investidor.nome_investidor}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PagamentoFormFields
            form={form}
            setForm={setForm}
            valorKwh={valorKwh}
            valorBruto={valorBruto}
            valorEfetivo={valorEfetivo}
            valorTotalTusdFioB={valorTotalTusdFioB}
            pagamentoId={pagamento.id}
          />
          <div className="flex justify-end gap-2 pt-4">
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
