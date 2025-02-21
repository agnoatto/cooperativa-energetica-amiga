
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "../CurrencyInput";
import { FaturaFileUpload } from "../FaturaFileUpload";
import { parseValue } from "../utils/calculateValues";
import { useQueryClient } from "@tanstack/react-query";

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
  arquivoConcessionariaPath: string | null | undefined;
  percentualDesconto: number;
  onSuccess: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: () => void;
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
  arquivoConcessionariaPath,
  percentualDesconto,
  onSuccess,
  onSubmit,
  onFileChange,
}: FaturaEditFormProps) {
  const queryClient = useQueryClient();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        <Label htmlFor="totalFatura">Valor Total Sem Assinatura</Label>
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
          faturaId={faturaId}
          arquivoNome={arquivoConcessionariaNome}
          arquivoPath={arquivoConcessionariaPath}
          onSuccess={() => {
            onSuccess({
              id: faturaId,
              consumo_kwh: Number(consumo),
              total_fatura: parseValue(totalFatura),
              fatura_concessionaria: parseValue(faturaConcessionaria),
              iluminacao_publica: parseValue(iluminacaoPublica),
              outros_valores: parseValue(outrosValores),
              saldo_energia_kwh: Number(saldoEnergiaKwh),
              observacao: observacao || null,
              data_vencimento: dataVencimento,
              percentual_desconto: percentualDesconto,
            });
          }}
          onFileChange={() => {
            queryClient.invalidateQueries({
              queryKey: ['faturas']
            });
            onFileChange();
          }}
        />
      </div>
    </form>
  );
}

