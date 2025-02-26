
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import type { FaturaEditModalProps } from "./types";
import { parseValue } from "./utils/calculateValues";
import { CooperadoInfoCard } from "./edit-modal/CooperadoInfoCard";
import { FaturaEditForm } from "./edit-modal/FaturaEditForm";
import { convertUTCToLocal, convertLocalToUTC } from "@/utils/dateFormatters";
import { Loader2 } from "lucide-react";

export function FaturaEditModal({ isOpen, onClose, fatura, onSuccess }: FaturaEditModalProps) {
  const [consumo, setConsumo] = useState(fatura.consumo_kwh?.toFixed(2) || "0.00");
  const [totalFatura, setTotalFatura] = useState(
    fatura.total_fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
  const [faturaConcessionaria, setFaturaConcessionaria] = useState(
    fatura.fatura_concessionaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
  const [iluminacaoPublica, setIluminacaoPublica] = useState(
    fatura.iluminacao_publica.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
  const [outrosValores, setOutrosValores] = useState(
    fatura.outros_valores.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
  const [saldoEnergiaKwh, setSaldoEnergiaKwh] = useState(
    fatura.saldo_energia_kwh?.toFixed(2) || "0.00"
  );
  const [observacao, setObservacao] = useState(fatura.observacao || '');
  const [dataVencimento, setDataVencimento] = useState(convertUTCToLocal(fatura.data_vencimento));
  const [arquivoConcessionariaNome, setArquivoConcessionariaNome] = useState(fatura.arquivo_concessionaria_nome);
  const [arquivoConcessionariaPath, setArquivoConcessionariaPath] = useState(fatura.arquivo_concessionaria_path);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Atualiza os estados quando a fatura muda
  useEffect(() => {
    setConsumo(fatura.consumo_kwh?.toFixed(2) || "0.00");
    setTotalFatura(fatura.total_fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setFaturaConcessionaria(fatura.fatura_concessionaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setIluminacaoPublica(fatura.iluminacao_publica.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setOutrosValores(fatura.outros_valores.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setSaldoEnergiaKwh(fatura.saldo_energia_kwh?.toFixed(2) || "0.00");
    setObservacao(fatura.observacao || '');
    setDataVencimento(convertUTCToLocal(fatura.data_vencimento));
    setArquivoConcessionariaNome(fatura.arquivo_concessionaria_nome);
    setArquivoConcessionariaPath(fatura.arquivo_concessionaria_path);
  }, [fatura]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!dataVencimento) {
      errors.dataVencimento = 'Data de vencimento é obrigatória';
    }

    if (Number(consumo) <= 0) {
      errors.consumo = 'Consumo deve ser maior que zero';
    }

    if (parseValue(totalFatura) <= 0) {
      errors.totalFatura = 'Valor total deve ser maior que zero';
    }

    if (parseValue(faturaConcessionaria) <= 0) {
      errors.faturaConcessionaria = 'Valor da conta de energia deve ser maior que zero';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsLoading(true);

    try {
      const result = await onSuccess({
        id: fatura.id,
        consumo_kwh: Number(consumo),
        total_fatura: parseValue(totalFatura),
        fatura_concessionaria: parseValue(faturaConcessionaria),
        iluminacao_publica: parseValue(iluminacaoPublica),
        outros_valores: parseValue(outrosValores),
        saldo_energia_kwh: Number(saldoEnergiaKwh),
        observacao: observacao || null,
        data_vencimento: convertLocalToUTC(dataVencimento),
        percentual_desconto: fatura.unidade_beneficiaria.percentual_desconto,
      });

      if (result instanceof Promise) {
        await result;
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar as alterações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = () => {
    const updatedFatura = {
      ...fatura,
      arquivo_concessionaria_nome: arquivoConcessionariaNome,
      arquivo_concessionaria_path: arquivoConcessionariaPath,
    };
    setArquivoConcessionariaNome(updatedFatura.arquivo_concessionaria_nome);
    setArquivoConcessionariaPath(updatedFatura.arquivo_concessionaria_path);
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
            arquivoConcessionariaNome={arquivoConcessionariaNome}
            arquivoConcessionariaPath={arquivoConcessionariaPath}
            percentualDesconto={fatura.unidade_beneficiaria.percentual_desconto}
            onSuccess={onSuccess}
            onSubmit={handleSubmit}
            onFileChange={handleFileChange}
            formErrors={formErrors}
          />
        </div>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
