
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CurrencyInput } from "../CurrencyInput";
import { FaturaFileUpload } from "../FaturaFileUpload";
import { parseValue, calculateValues } from "../utils/calculateValues";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatters";

interface FaturaEditFormProps {
  faturaId: string;
  consumo: string;
  setConsumo: (value: string) => void;
  totalFatura: string;
  setTotalFatura: (value: string) => void;
  faturaConcessionaria: string;
  setFaturaConcessionaria: (value: string) => void;
  iluminacaoPublica: string;
  setIluminacaoPublica: (value: string) => void;
  outrosValores: string;
  setOutrosValores: (value: string) => void;
  saldoEnergiaKwh: string;
  setSaldoEnergiaKwh: (value: string) => void;
  observacao: string;
  setObservacao: (value: string) => void;
  dataVencimento: string;
  setDataVencimento: (value: string) => void;
  arquivoConcessionariaNome: string | null | undefined;
  setArquivoConcessionariaNome: (value: string | null) => void;
  arquivoConcessionariaPath: string | null | undefined;
  setArquivoConcessionariaPath: (value: string | null) => void;
  arquivoConcessionariaTipo?: string | null | undefined;
  setArquivoConcessionariaTipo?: (value: string | null) => void;
  arquivoConcessionariaTamanho?: number | null | undefined;
  setArquivoConcessionariaTamanho?: (value: number | null) => void;
  percentualDesconto: number;
  onSuccess: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  formErrors: Record<string, string>;
}

export function FaturaEditForm({
  faturaId,
  consumo,
  setConsumo,
  totalFatura,
  setTotalFatura,
  faturaConcessionaria,
  setFaturaConcessionaria,
  iluminacaoPublica,
  setIluminacaoPublica,
  outrosValores,
  setOutrosValores,
  saldoEnergiaKwh,
  setSaldoEnergiaKwh,
  observacao,
  setObservacao,
  dataVencimento,
  setDataVencimento,
  arquivoConcessionariaNome,
  setArquivoConcessionariaNome,
  arquivoConcessionariaPath,
  setArquivoConcessionariaPath,
  arquivoConcessionariaTipo,
  setArquivoConcessionariaTipo,
  arquivoConcessionariaTamanho,
  setArquivoConcessionariaTamanho,
  percentualDesconto,
  onSuccess,
  onSubmit,
  onFileChange,
  formErrors,
}: FaturaEditFormProps) {
  const queryClient = useQueryClient();
  const [valorAssinatura, setValorAssinatura] = useState("0");

  // Calcula o valor da assinatura sempre que os valores relevantes mudarem
  useEffect(() => {
    const calculatedValues = calculateValues(
      totalFatura || "0",
      iluminacaoPublica || "0",
      outrosValores || "0",
      faturaConcessionaria || "0",
      percentualDesconto
    );
    
    setValorAssinatura(formatCurrency(calculatedValues.valor_assinatura));
  }, [totalFatura, iluminacaoPublica, outrosValores, faturaConcessionaria, percentualDesconto]);

  // Handler para atualização de arquivo
  const handleFileUpdateSuccess = (data: any) => {
    onSuccess(data);
    
    // Recarregar dados das faturas para atualizar a interface
    queryClient.invalidateQueries({
      queryKey: ['faturas']
    });
  };

  // Handler para mudança de arquivo
  const handleFileChangeInternal = (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => {
    // Função para atualizar o estado local quando o arquivo é adicionado ou removido
    onFileChange(nome, path, tipo, tamanho);
    
    // Invalidar cache para forçar atualização
    queryClient.invalidateQueries({
      queryKey: ['faturas']
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="dataVencimento" className="font-semibold">
          Data de Vencimento *
        </Label>
        <Input
          type="date"
          id="dataVencimento"
          value={dataVencimento}
          onChange={(e) => setDataVencimento(e.target.value)}
          required
          className={formErrors.dataVencimento ? 'border-red-500' : ''}
        />
        {formErrors.dataVencimento && (
          <span className="text-sm text-red-500">{formErrors.dataVencimento}</span>
        )}
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="consumo" className="font-semibold">
          Consumo (kWh) *
        </Label>
        <Input
          type="number"
          id="consumo"
          value={consumo}
          onChange={(e) => setConsumo(e.target.value)}
          step="0.01"
          min="0"
          required
          className={formErrors.consumo ? 'border-red-500' : ''}
        />
        {formErrors.consumo && (
          <span className="text-sm text-red-500">{formErrors.consumo}</span>
        )}
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="totalFatura" className="font-semibold">
          Valor Total Sem Assinatura *
        </Label>
        <CurrencyInput
          id="totalFatura"
          value={totalFatura}
          onChange={setTotalFatura}
          required
          decimalScale={2}
          className={formErrors.totalFatura ? 'border-red-500' : ''}
        />
        {formErrors.totalFatura && (
          <span className="text-sm text-red-500">{formErrors.totalFatura}</span>
        )}
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="faturaConcessionaria" className="font-semibold">
          Valor Conta de Energia *
        </Label>
        <CurrencyInput
          id="faturaConcessionaria"
          value={faturaConcessionaria}
          onChange={setFaturaConcessionaria}
          required
          decimalScale={2}
          className={formErrors.faturaConcessionaria ? 'border-red-500' : ''}
        />
        {formErrors.faturaConcessionaria && (
          <span className="text-sm text-red-500">{formErrors.faturaConcessionaria}</span>
        )}
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="valorAssinatura" className="font-semibold">
          Valor da Assinatura (Calculado)
        </Label>
        <Input
          id="valorAssinatura"
          value={valorAssinatura}
          readOnly
          className="bg-gray-50"
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="iluminacaoPublica" className="font-semibold">
          Iluminação Pública *
        </Label>
        <CurrencyInput
          id="iluminacaoPublica"
          value={iluminacaoPublica}
          onChange={setIluminacaoPublica}
          required
          decimalScale={2}
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="outrosValores" className="font-semibold">
          Outros Valores *
        </Label>
        <CurrencyInput
          id="outrosValores"
          value={outrosValores}
          onChange={setOutrosValores}
          required
          decimalScale={2}
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="saldoEnergiaKwh" className="font-semibold">
          Saldo de Energia (kWh) *
        </Label>
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
        <Label className="font-semibold">Conta de Energia (PDF)</Label>
        <FaturaFileUpload
          faturaId={faturaId}
          arquivoNome={arquivoConcessionariaNome}
          arquivoPath={arquivoConcessionariaPath}
          arquivoTipo={arquivoConcessionariaTipo}
          arquivoTamanho={arquivoConcessionariaTamanho}
          onSuccess={handleFileUpdateSuccess}
          onFileChange={(nome, path, tipo, tamanho) => {
            handleFileChangeInternal(nome, path, tipo, tamanho);
          }}
        />
      </div>

      {Object.keys(formErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Por favor, corrija os erros no formulário antes de salvar.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
