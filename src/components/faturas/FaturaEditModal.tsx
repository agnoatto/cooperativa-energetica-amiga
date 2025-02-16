
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
import { useState } from "react";
import { CurrencyInput } from "./CurrencyInput";
import { FaturaFileUpload } from "./FaturaFileUpload";
import type { FaturaEditModalProps } from "./types";
import { parseValue } from "./utils/calculateValues";
import { formatarDocumento } from "@/utils/formatters";

export function FaturaEditModal({ isOpen, onClose, fatura, onSuccess }: FaturaEditModalProps) {
  const [consumo, setConsumo] = useState(fatura.consumo_kwh?.toFixed(2) || "0.00");
  const [totalFatura, setTotalFatura] = useState(fatura.total_fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const [faturaConcessionaria, setFaturaConcessionaria] = useState(fatura.fatura_concessionaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const [iluminacaoPublica, setIluminacaoPublica] = useState(fatura.iluminacao_publica.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const [outrosValores, setOutrosValores] = useState(fatura.outros_valores.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const [saldoEnergiaKwh, setSaldoEnergiaKwh] = useState(fatura.saldo_energia_kwh?.toFixed(2) || "0.00");
  const [observacao, setObservacao] = useState(fatura.observacao || '');
  const [dataVencimento, setDataVencimento] = useState(fatura.data_vencimento);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = onSuccess({
        id: fatura.id,
        consumo_kwh: Number(consumo),
        total_fatura: parseValue(totalFatura),
        fatura_concessionaria: parseValue(faturaConcessionaria),
        iluminacao_publica: parseValue(iluminacaoPublica),
        outros_valores: parseValue(outrosValores),
        saldo_energia_kwh: Number(saldoEnergiaKwh),
        observacao: observacao || null,
        data_vencimento: dataVencimento,
        percentual_desconto: fatura.unidade_beneficiaria.percentual_desconto,
      });

      if (result instanceof Promise) {
        await result;
      }
      
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>

        {/* Informações do Cooperado */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex flex-col space-y-1">
            <span className="font-medium text-gray-900">
              {fatura.unidade_beneficiaria.cooperado.nome}
            </span>
            <div className="text-sm text-gray-500 space-x-2">
              <span>{formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}</span>
              <span>•</span>
              <span>
                UC: {fatura.unidade_beneficiaria.numero_uc}
                {fatura.unidade_beneficiaria.apelido && (
                  <span className="text-gray-400 ml-1">
                    ({fatura.unidade_beneficiaria.apelido})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="dataVencimento">Data de Vencimento</Label>
            <Input
              type="date"
              id="dataVencimento"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="consumo">Consumo (kWh)</Label>
            <Input
              type="number"
              id="consumo"
              value={consumo}
              onChange={(e) => setConsumo(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="totalFatura">Valor Total Original</Label>
            <CurrencyInput
              id="totalFatura"
              value={totalFatura}
              onChange={setTotalFatura}
              required
              decimalScale={2}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="faturaConcessionaria">Valor Conta de Energia</Label>
            <CurrencyInput
              id="faturaConcessionaria"
              value={faturaConcessionaria}
              onChange={setFaturaConcessionaria}
              required
              decimalScale={2}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="iluminacaoPublica">Iluminação Pública</Label>
            <CurrencyInput
              id="iluminacaoPublica"
              value={iluminacaoPublica}
              onChange={setIluminacaoPublica}
              required
              decimalScale={2}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="outrosValores">Outros Valores</Label>
            <CurrencyInput
              id="outrosValores"
              value={outrosValores}
              onChange={setOutrosValores}
              required
              decimalScale={2}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="saldoEnergiaKwh">Saldo de Energia (kWh)</Label>
            <Input
              type="number"
              id="saldoEnergiaKwh"
              value={saldoEnergiaKwh}
              onChange={(e) => setSaldoEnergiaKwh(e.target.value)}
              step="0.01"
              min="0"
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
              rows={3}
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label>Conta de Energia (PDF)</Label>
            <FaturaFileUpload
              faturaId={fatura.id}
              arquivoNome={fatura.arquivo_concessionaria_nome}
              arquivoPath={fatura.arquivo_concessionaria_path}
              onSuccess={() => {
                // Recarregar dados da fatura após upload/remoção do arquivo
                onSuccess({
                  id: fatura.id,
                  consumo_kwh: Number(consumo),
                  total_fatura: parseValue(totalFatura),
                  fatura_concessionaria: parseValue(faturaConcessionaria),
                  iluminacao_publica: parseValue(iluminacaoPublica),
                  outros_valores: parseValue(outrosValores),
                  saldo_energia_kwh: Number(saldoEnergiaKwh),
                  observacao: observacao || null,
                  data_vencimento: dataVencimento,
                  percentual_desconto: fatura.unidade_beneficiaria.percentual_desconto,
                });
              }}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
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
