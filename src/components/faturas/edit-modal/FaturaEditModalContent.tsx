
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { CooperadoInfoCard } from "./CooperadoInfoCard";
import { FaturaEditForm } from "./FaturaEditForm";
import { FaturaFormState, FaturaFormErrors } from "./hooks/useFaturaEditForm";

interface FaturaEditModalContentProps {
  faturaId: string;
  formState: FaturaFormState;
  updateField: (field: keyof FaturaFormState, value: any) => void;
  isLoading: boolean;
  formErrors: FaturaFormErrors;
  handleFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
  cooperadoInfo: {
    nome: string;
    documento: string;
    numeroUC: string;
    apelido: string | null;
  };
  percentualDesconto: number;
  onSuccess: (data: any) => Promise<void>;
}

export function FaturaEditModalContent({
  faturaId,
  formState,
  updateField,
  isLoading,
  formErrors,
  handleFileChange,
  handleSubmit,
  onClose,
  cooperadoInfo,
  percentualDesconto,
  onSuccess
}: FaturaEditModalContentProps) {
  return (
    <>
      <div className="px-6">
        <CooperadoInfoCard
          nome={cooperadoInfo.nome}
          documento={cooperadoInfo.documento}
          numeroUC={cooperadoInfo.numeroUC}
          apelido={cooperadoInfo.apelido}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        <FaturaEditForm
          faturaId={faturaId}
          consumo={formState.consumo}
          setConsumo={(value) => updateField('consumo', value)}
          totalFatura={formState.totalFatura}
          setTotalFatura={(value) => updateField('totalFatura', value)}
          faturaConcessionaria={formState.faturaConcessionaria}
          setFaturaConcessionaria={(value) => updateField('faturaConcessionaria', value)}
          iluminacaoPublica={formState.iluminacaoPublica}
          setIluminacaoPublica={(value) => updateField('iluminacaoPublica', value)}
          outrosValores={formState.outrosValores}
          setOutrosValores={(value) => updateField('outrosValores', value)}
          saldoEnergiaKwh={formState.saldoEnergiaKwh}
          setSaldoEnergiaKwh={(value) => updateField('saldoEnergiaKwh', value)}
          observacao={formState.observacao}
          setObservacao={(value) => updateField('observacao', value)}
          dataVencimento={formState.dataVencimento}
          setDataVencimento={(value) => updateField('dataVencimento', value)}
          arquivoConcessionariaNome={formState.arquivoConcessionariaNome}
          setArquivoConcessionariaNome={(value) => updateField('arquivoConcessionariaNome', value)}
          arquivoConcessionariaPath={formState.arquivoConcessionariaPath}
          setArquivoConcessionariaPath={(value) => updateField('arquivoConcessionariaPath', value)}
          arquivoConcessionariaTipo={formState.arquivoConcessionariaTipo}
          setArquivoConcessionariaTipo={(value) => updateField('arquivoConcessionariaTipo', value)}
          arquivoConcessionariaTamanho={formState.arquivoConcessionariaTamanho}
          setArquivoConcessionariaTamanho={(value) => updateField('arquivoConcessionariaTamanho', value)}
          percentualDesconto={percentualDesconto}
          onSuccess={onSuccess}
          onSubmit={handleSubmit}
          onFileChange={handleFileChange}
          formErrors={formErrors as Record<string, string>}
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
    </>
  );
}
