
/**
 * Modal para registrar pagamentos de lançamentos financeiros
 * 
 * Este componente permite registrar o pagamento de um lançamento financeiro
 * com opções para incluir valores específicos, juros, descontos e observações.
 */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, DollarSign, TrendingUp, TrendingDown, Calculator } from "lucide-react";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { ContaBancariaSelect } from "@/components/contas-bancos/ContaBancariaSelect";

interface RegistrarPagamentoModalProps {
  lancamento: LancamentoFinanceiro | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    valorPago: number,
    valorJuros: number,
    valorDesconto: number,
    dataPagamento: string,
    observacao: string,
    contaBancariaId?: string
  ) => Promise<void>;
  onSuccess?: () => void; // Adicionando onSuccess como prop opcional
}

export function RegistrarPagamentoModal({
  lancamento,
  isOpen,
  onClose,
  onConfirm,
  onSuccess,
}: RegistrarPagamentoModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [valorPago, setValorPago] = useState("");
  const [valorJuros, setValorJuros] = useState("");
  const [valorDesconto, setValorDesconto] = useState("");
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0]);
  const [observacao, setObservacao] = useState("");
  const [contaBancariaId, setContaBancariaId] = useState("");

  useEffect(() => {
    if (lancamento && isOpen) {
      setValorPago(lancamento.valor_original?.toString() || lancamento.valor?.toString() || "0");
      setValorJuros("0");
      setValorDesconto("0");
      setDataPagamento(new Date().toISOString().split('T')[0]);
      setObservacao("");
      // Manter a conta bancária se já estiver selecionada
      if (lancamento.conta_bancaria_id) {
        setContaBancariaId(lancamento.conta_bancaria_id);
      } else {
        setContaBancariaId("");
      }
    }
  }, [lancamento, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lancamento) return;
    setIsLoading(true);

    try {
      await onConfirm(
        parseFloat(valorPago) || 0,
        parseFloat(valorJuros) || 0,
        parseFloat(valorDesconto) || 0,
        dataPagamento,
        observacao,
        contaBancariaId || undefined
      );
      
      if (onSuccess) {
        onSuccess(); // Chamando onSuccess se fornecido
      }
      
      onClose();
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular valor líquido
  const valorOriginal = lancamento?.valor_original || lancamento?.valor || 0;
  const vPago = parseFloat(valorPago) || 0;
  const vJuros = parseFloat(valorJuros) || 0;
  const vDesconto = parseFloat(valorDesconto) || 0;
  const valorLiquido = vPago - vJuros + vDesconto;
  
  // Calcular diferença
  const diferenca = valorLiquido - valorOriginal;

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const value = e.target.value.replace(/[^\d,.]/g, '').replace(',', '.');
    setter(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Valor Original:</span>
              <span className="font-semibold">{formatarMoeda(valorOriginal)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="valorPago" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-gray-500" />
                Valor Pago
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                <Input
                  id="valorPago"
                  className="pl-9"
                  value={valorPago}
                  onChange={(e) => handleValorChange(e, setValorPago)}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorJuros" className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  Juros
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <Input
                    id="valorJuros"
                    className="pl-9"
                    value={valorJuros}
                    onChange={(e) => handleValorChange(e, setValorJuros)}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorDesconto" className="flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  Desconto
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <Input
                    id="valorDesconto"
                    className="pl-9"
                    value={valorDesconto}
                    onChange={(e) => handleValorChange(e, setValorDesconto)}
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataPagamento">Data do Pagamento</Label>
              <Input
                id="dataPagamento"
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contaBancaria">Conta Bancária</Label>
              <ContaBancariaSelect
                value={contaBancariaId}
                onChange={setContaBancariaId}
                placeholder="Selecione a conta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacao">Observações</Label>
              <Textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Informações adicionais sobre o pagamento..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between items-center font-medium">
              <span className="flex items-center gap-1">
                <Calculator className="h-4 w-4 text-gray-600" />
                Valor Líquido:
              </span>
              <span className="text-lg font-bold">{formatarMoeda(valorLiquido)}</span>
            </div>
            
            {diferenca !== 0 && (
              <div className="flex justify-between items-center text-sm">
                <span>Diferença:</span>
                <span className={diferenca > 0 ? 'text-green-600' : diferenca < 0 ? 'text-red-600' : ''}>
                  {formatarMoeda(diferenca)}
                  {diferenca > 0 ? ' (a mais)' : diferenca < 0 ? ' (a menos)' : ''}
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Registrar Pagamento"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
