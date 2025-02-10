
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
import { useEffect, useState } from "react";
import { CurrencyInput } from "./CurrencyInput";
import type { FaturaEditModalProps } from "./types";
import { parseValue } from "./utils/calculateValues";

export function FaturaEditModal({ isOpen, onClose, fatura, onSuccess }: FaturaEditModalProps) {
  const [consumo, setConsumo] = useState(0);
  const [totalFatura, setTotalFatura] = useState("0,00");
  const [faturaConcessionaria, setFaturaConcessionaria] = useState("0,00");
  const [iluminacaoPublica, setIluminacaoPublica] = useState("0,00");
  const [outrosValores, setOutrosValores] = useState("0,00");
  const [saldoEnergiaKwh, setSaldoEnergiaKwh] = useState(0);
  const [observacao, setObservacao] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fatura && isOpen) {
      console.log('Inicializando campos do modal com fatura:', fatura);
      setConsumo(fatura.consumo_kwh || 0);
      setTotalFatura(fatura.total_fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setFaturaConcessionaria(fatura.fatura_concessionaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setIluminacaoPublica(fatura.iluminacao_publica.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setOutrosValores(fatura.outros_valores.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setSaldoEnergiaKwh(fatura.saldo_energia_kwh || 0);
      setObservacao(fatura.observacao || '');
      setDataVencimento(fatura.data_vencimento);
    }
  }, [fatura, isOpen]);

  const resetForm = () => {
    console.log('Resetando formulário');
    setConsumo(0);
    setTotalFatura("0,00");
    setFaturaConcessionaria("0,00");
    setIluminacaoPublica("0,00");
    setOutrosValores("0,00");
    setSaldoEnergiaKwh(0);
    setObservacao("");
    setDataVencimento("");
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    console.log('Iniciando submissão do formulário');
    setIsLoading(true);
    
    try {
      await onSuccess({
        id: fatura.id,
        consumo_kwh: consumo,
        total_fatura: parseValue(totalFatura),
        fatura_concessionaria: parseValue(faturaConcessionaria),
        iluminacao_publica: parseValue(iluminacaoPublica),
        outros_valores: parseValue(outrosValores),
        saldo_energia_kwh: saldoEnergiaKwh,
        observacao: observacao || null,
        data_vencimento: dataVencimento,
        percentual_desconto: fatura.unidade_beneficiaria.percentual_desconto,
      });
      
      console.log('Submissão bem-sucedida, fechando modal');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar fatura:', error);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      console.log('Fechando modal');
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent 
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="dataVencimento">Data de Vencimento</Label>
            <Input
              type="date"
              id="dataVencimento"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="consumo">Consumo (kWh)</Label>
            <Input
              type="number"
              id="consumo"
              value={consumo}
              onChange={(e) => setConsumo(Number(e.target.value))}
              step="0.01"
              min="0"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="totalFatura">Valor Total Original</Label>
            <CurrencyInput
              id="totalFatura"
              value={totalFatura}
              onChange={setTotalFatura}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="faturaConcessionaria">Valor Conta de Energia</Label>
            <CurrencyInput
              id="faturaConcessionaria"
              value={faturaConcessionaria}
              onChange={setFaturaConcessionaria}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="iluminacaoPublica">Iluminação Pública</Label>
            <CurrencyInput
              id="iluminacaoPublica"
              value={iluminacaoPublica}
              onChange={setIluminacaoPublica}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="outrosValores">Outros Valores</Label>
            <CurrencyInput
              id="outrosValores"
              value={outrosValores}
              onChange={setOutrosValores}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="saldoEnergiaKwh">Saldo de Energia (kWh)</Label>
            <Input
              type="number"
              id="saldoEnergiaKwh"
              value={saldoEnergiaKwh}
              onChange={(e) => setSaldoEnergiaKwh(Number(e.target.value))}
              step="0.01"
              min="0"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Adicione observações relevantes sobre a fatura..."
              className="resize-none"
              disabled={isLoading}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

