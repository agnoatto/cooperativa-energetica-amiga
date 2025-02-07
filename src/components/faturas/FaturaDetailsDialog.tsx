
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Fatura } from "@/types/fatura";

interface FaturaDetailsDialogProps {
  fatura: Fatura;
  isOpen: boolean;
  onClose: () => void;
}

export function FaturaDetailsDialog({ fatura, isOpen, onClose }: FaturaDetailsDialogProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const calcularValorAssinatura = () => {
    // Base para desconto = Valor Total - Iluminação - Outros
    const baseDesconto = fatura.total_fatura - fatura.iluminacao_publica - fatura.outros_valores;
    // Valor após desconto = Base - Valor do Desconto
    const valorAposDesconto = baseDesconto - fatura.valor_desconto;
    // Valor final da assinatura = Valor após desconto - Conta de Energia
    return valorAposDesconto - fatura.fatura_concessionaria;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Fatura</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          <div className="space-y-2">
            <h3 className="font-semibold">Informações do Cliente</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Cliente:</span>
                <p>{fatura.unidade_beneficiaria.cooperado.nome}</p>
              </div>
              <div>
                <span className="text-muted-foreground">CPF/CNPJ:</span>
                <p>{fatura.unidade_beneficiaria.cooperado.documento}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Unidade Consumidora:</span>
                <p>{fatura.unidade_beneficiaria.numero_uc}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Data de Vencimento:</span>
                <p>{format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Informações de Consumo */}
          <div className="space-y-2">
            <h3 className="font-semibold">Informações de Consumo</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Consumo:</span>
                <p>{fatura.consumo_kwh} kWh</p>
              </div>
              <div>
                <span className="text-muted-foreground">Saldo de Energia:</span>
                <p>{fatura.saldo_energia_kwh} kWh</p>
              </div>
              <div>
                <span className="text-muted-foreground">Percentual de Desconto:</span>
                <p>{fatura.unidade_beneficiaria.percentual_desconto}%</p>
              </div>
            </div>
          </div>

          {/* Detalhamento de Valores */}
          <div className="space-y-2">
            <h3 className="font-semibold">Detalhamento de Valores</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Valor Total da Fatura:</span>
                <span>{formatCurrency(fatura.total_fatura)}</span>
              </div>
              <div className="flex justify-between">
                <span>Iluminação Pública:</span>
                <span>{formatCurrency(fatura.iluminacao_publica)}</span>
              </div>
              <div className="flex justify-between">
                <span>Outros Valores:</span>
                <span>{formatCurrency(fatura.outros_valores)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor do Desconto:</span>
                <span className="text-green-600">{formatCurrency(fatura.valor_desconto)}</span>
              </div>
              <div className="flex justify-between">
                <span>Conta de Energia:</span>
                <span>{formatCurrency(fatura.fatura_concessionaria)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Valor da Assinatura:</span>
                <span>{formatCurrency(calcularValorAssinatura())}</span>
              </div>
            </div>
          </div>

          {/* Economia */}
          <div className="space-y-2">
            <h3 className="font-semibold">Economia</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Economia do Mês:</span>
                <p className="text-green-600">{formatCurrency(fatura.valor_desconto)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Economia Acumulada:</span>
                <p className="text-green-600">{formatCurrency(fatura.economia_acumulada)}</p>
              </div>
            </div>
          </div>

          {/* Observações */}
          {fatura.observacao && (
            <div className="space-y-2">
              <h3 className="font-semibold">Observações</h3>
              <div className="text-sm bg-muted p-3 rounded-md">
                {fatura.observacao}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

