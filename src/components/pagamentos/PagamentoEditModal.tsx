
/**
 * Componente de modal para edição de pagamentos de usinas
 * 
 * Este componente permite editar informações de um pagamento específico,
 * como geração de energia, valores, datas de vencimento e emissão.
 * Calcula automaticamente valores derivados baseados na entrada do usuário.
 */
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatarMoeda } from "@/utils/formatters";
import { convertLocalToUTC } from "@/utils/dateFormatters";
import { PagamentoData } from "./types/pagamento";
import { usePagamentoForm } from "./hooks/usePagamentoForm";

interface PagamentoEditModalProps {
  pagamento: PagamentoData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function PagamentoEditModal({ pagamento, isOpen, onClose, onSave }: PagamentoEditModalProps) {
  // Estados locais para os campos do formulário
  const [geracao, setGeracao] = useState<number>(0);
  const [valorKwh, setValorKwh] = useState<number>(0);
  const [tusdFioB, setTusdFioB] = useState<number>(0);
  const [valorTusdFioB, setValorTusdFioB] = useState<number>(0);
  const [valorBruto, setValorBruto] = useState<number>(0);
  const [valorConcessionaria, setValorConcessionaria] = useState<number>(0);
  const [dataVencimentoConcessionaria, setDataVencimentoConcessionaria] = useState<Date | undefined>();
  const [dataEmissao, setDataEmissao] = useState<Date | undefined>();
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>();
  
  // Custom hook para manipular o formulário
  const { salvarPagamento, isSaving } = usePagamentoForm();

  // Resetar campos quando o pagamento mudar ou o modal abrir
  useEffect(() => {
    if (pagamento && isOpen) {
      console.log("[PagamentoEditModal] Carregando dados do pagamento:", pagamento);
      setGeracao(pagamento.geracao_kwh);
      setValorKwh(pagamento.usina?.valor_kwh || 0);
      setTusdFioB(pagamento.tusd_fio_b);
      setValorTusdFioB(pagamento.valor_tusd_fio_b);
      setValorConcessionaria(pagamento.valor_concessionaria);
      
      // Calcular valor bruto
      const calculoValorBruto = pagamento.geracao_kwh * (pagamento.usina?.valor_kwh || 0);
      setValorBruto(calculoValorBruto);
      
      // Converter datas
      if (pagamento.data_vencimento_concessionaria) {
        setDataVencimentoConcessionaria(new Date(pagamento.data_vencimento_concessionaria));
      }
      
      if (pagamento.data_emissao) {
        setDataEmissao(new Date(pagamento.data_emissao));
      }
      
      if (pagamento.data_vencimento) {
        setDataVencimento(new Date(pagamento.data_vencimento));
      }
    }
  }, [pagamento, isOpen]);

  // Calcula o valor da TUSD Fio B com base na geração e TUSD
  useEffect(() => {
    const calculoValorTusdFioB = geracao * tusdFioB;
    setValorTusdFioB(calculoValorTusdFioB);
  }, [geracao, tusdFioB]);

  // Calcula o valor bruto a receber com base na geração e valor do kWh
  useEffect(() => {
    const calculoValorBruto = geracao * valorKwh;
    setValorBruto(calculoValorBruto);
  }, [geracao, valorKwh]);

  // Calcula a data de vencimento como 90 dias após a data de emissão
  useEffect(() => {
    if (dataEmissao) {
      const novaDataVencimento = addDays(dataEmissao, 90);
      setDataVencimento(novaDataVencimento);
    }
  }, [dataEmissao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pagamento) {
      toast.error("Dados do pagamento não encontrados");
      return;
    }
    
    try {
      // Calcular valor total (valor bruto - valor TUSD FioB - valor concessionária)
      const valorTotal = valorBruto - valorTusdFioB - valorConcessionaria;
      
      // Preparar dados para salvar
      const dadosAtualizados = {
        id: pagamento.id,
        geracao_kwh: geracao,
        tusd_fio_b: tusdFioB,
        valor_tusd_fio_b: valorTusdFioB,
        valor_concessionaria: valorConcessionaria,
        valor_total: valorTotal,
        data_vencimento_concessionaria: dataVencimentoConcessionaria ? convertLocalToUTC(dataVencimentoConcessionaria.toISOString()) : null,
        data_emissao: dataEmissao ? convertLocalToUTC(dataEmissao.toISOString()) : null,
        data_vencimento: dataVencimento ? convertLocalToUTC(dataVencimento.toISOString()) : null
      };
      
      console.log("[PagamentoEditModal] Salvando dados:", dadosAtualizados);
      
      await salvarPagamento(dadosAtualizados);
      toast.success("Pagamento atualizado com sucesso");
      onSave();
      onClose();
    } catch (error: any) {
      console.error("[PagamentoEditModal] Erro ao salvar pagamento:", error);
      toast.error(`Erro ao atualizar pagamento: ${error.message || "Erro desconhecido"}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Pagamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Informações da Usina */}
            <div className="col-span-2 mb-2">
              <h3 className="text-lg font-medium">Dados da Usina</h3>
              <p className="text-sm text-muted-foreground">
                {pagamento?.usina?.unidade_usina?.numero_uc} - {pagamento?.usina?.investidor?.nome_investidor}
              </p>
            </div>
            
            {/* Geração */}
            <div className="space-y-2">
              <Label htmlFor="geracao">Geração (kWh)</Label>
              <Input
                id="geracao"
                type="number"
                step="0.01"
                min="0"
                value={geracao}
                onChange={(e) => setGeracao(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            {/* Valor kWh - Agora somente leitura */}
            <div className="space-y-2">
              <Label htmlFor="valorKwh">Valor do kWh (R$)</Label>
              <Input
                id="valorKwh"
                type="number"
                step="0.0001"
                min="0"
                value={valorKwh}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            
            {/* TUSD Fio B */}
            <div className="space-y-2">
              <Label htmlFor="tusdFioB">TUSD Fio B (R$/kWh)</Label>
              <Input
                id="tusdFioB"
                type="number"
                step="0.0001"
                min="0"
                value={tusdFioB}
                onChange={(e) => setTusdFioB(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            {/* Valor TUSD Fio B Total */}
            <div className="space-y-2">
              <Label htmlFor="valorTusdFioB">Valor Total TUSD Fio B</Label>
              <Input
                id="valorTusdFioB"
                type="text"
                value={formatarMoeda(valorTusdFioB)}
                disabled
              />
            </div>
            
            {/* Valor Bruto */}
            <div className="space-y-2">
              <Label htmlFor="valorBruto">Valor Bruto (R$)</Label>
              <Input
                id="valorBruto"
                type="text"
                value={formatarMoeda(valorBruto)}
                disabled
              />
            </div>
            
            {/* Valor Concessionária */}
            <div className="space-y-2">
              <Label htmlFor="valorConcessionaria">Valor Concessionária (R$)</Label>
              <Input
                id="valorConcessionaria"
                type="number"
                step="0.01"
                min="0"
                value={valorConcessionaria}
                onChange={(e) => setValorConcessionaria(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            {/* Data Vencimento Concessionária */}
            <div className="space-y-2">
              <Label htmlFor="dataVencimentoConcessionaria">Data Vencimento Concessionária</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dataVencimentoConcessionaria"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataVencimentoConcessionaria && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataVencimentoConcessionaria ? (
                      format(dataVencimentoConcessionaria, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      "Selecione uma data"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataVencimentoConcessionaria}
                    onSelect={setDataVencimentoConcessionaria}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Data Emissão */}
            <div className="space-y-2">
              <Label htmlFor="dataEmissao">Data de Emissão</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dataEmissao"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataEmissao && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataEmissao ? (
                      format(dataEmissao, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      "Selecione uma data"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataEmissao}
                    onSelect={setDataEmissao}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Data Vencimento (90 dias após emissão) */}
            <div className="space-y-2">
              <Label htmlFor="dataVencimento">Data de Vencimento (90 dias após emissão)</Label>
              <Input
                id="dataVencimento"
                type="text"
                value={dataVencimento ? format(dataVencimento, "dd/MM/yyyy", { locale: ptBR }) : ""}
                disabled
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
