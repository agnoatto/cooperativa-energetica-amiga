
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { FaturaEditModalProps } from "./types";
import { parseValue } from "./utils/calculateValues";
import { CooperadoInfoCard } from "./edit-modal/CooperadoInfoCard";
import { FaturaEditForm } from "./edit-modal/FaturaEditForm";

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
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <CooperadoInfoCard
            nome={fatura.unidade_beneficiaria.cooperado.nome}
            documento={fatura.unidade_beneficiaria.cooperado.documento}
            numeroUC={fatura.unidade_beneficiaria.numero_uc}
            apelido={fatura.unidade_beneficiaria.apelido}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <FaturaEditForm
            faturaId={fatura.id}
            consumo={consumo}
            setConsumo={setConsumo}
            totalFatura={totalFatura}
            setTotalFatura={setTotalFatura}
            faturaConcessionaria={faturaConcessionaria}
            setFaturaConcessionaria={setFaturaConcessionaria}
            iluminacaoPublica={iluminacaoPublica}
            setIluminacaoPublica={setIluminacaoPublica}
            outrosValores={outrosValores}
            setOutrosValores={setOutrosValores}
            saldoEnergiaKwh={saldoEnergiaKwh}
            setSaldoEnergiaKwh={setSaldoEnergiaKwh}
            observacao={observacao}
            setObservacao={setObservacao}
            dataVencimento={dataVencimento}
            setDataVencimento={setDataVencimento}
            arquivoConcessionariaNome={fatura.arquivo_concessionaria_nome}
            arquivoConcessionariaPath={fatura.arquivo_concessionaria_path}
            percentualDesconto={fatura.unidade_beneficiaria.percentual_desconto}
            onSuccess={onSuccess}
            onSubmit={handleSubmit}
          />
        </div>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
