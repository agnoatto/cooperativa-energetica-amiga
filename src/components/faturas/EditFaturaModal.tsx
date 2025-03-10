
import React, { useCallback } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEditFatura } from "./edit/hooks/useEditFatura";
import { FaturaUploadArea } from "./upload/FaturaUploadArea";
import { UpdateFaturaInput } from "@/hooks/faturas/types/updateFatura";
import { formatCurrency } from "@/utils/formatters";
import { useUpdateFaturaStatus } from "@/hooks/faturas/useUpdateFaturaStatus";

interface EditFaturaModalProps {
  fatura: Fatura;
  isOpen: boolean;
  onClose: () => void;
  // Modificando o tipo para corresponder ao retorno de Promise<Fatura>
  onSave: (data: UpdateFaturaInput) => Promise<Fatura>;
  isProcessing: boolean;
  refetchFaturas?: () => void;
}

export function EditFaturaModal({
  fatura,
  isOpen,
  onClose,
  onSave,
  isProcessing,
  refetchFaturas
}: EditFaturaModalProps) {
  const { updateFaturaStatus } = useUpdateFaturaStatus();
  
  const {
    formState,
    isCalculating,
    localTotalFatura,
    setLocalTotalFatura,
    localIluminacaoPublica,
    setLocalIluminacaoPublica,
    localOutrosValores,
    setLocalOutrosValores,
    localFaturaConcessionaria,
    setLocalFaturaConcessionaria,
    localValorDesconto,
    setLocalValorDesconto,
    localValorAssinatura,
    setLocalValorAssinatura,
    arquivoInfo,
    handleFileChange,
    handleCalcularClick,
    handleSubmit
  } = useEditFatura(fatura, onSave, refetchFaturas);

  // Novo método para atualizar o status da fatura após upload
  const handleStatusUpdate = useCallback(async (newStatus: FaturaStatus) => {
    // Se a fatura já está no status sugerido, não faz nada
    if (fatura.status === newStatus) return;
    
    // Se estamos sugerindo mudar para "gerada" e o status atual é "pendente"
    if (newStatus === 'gerada' && fatura.status === 'pendente') {
      try {
        // Perguntar ao usuário se deseja mudar o status
        if (window.confirm(`Os dados da fatura foram preenchidos. Deseja marcar a fatura como "Gerada"?`)) {
          await updateFaturaStatus({
            id: fatura.id,
            status: 'gerada',
            observacao: 'Fatura preenchida, pronta para envio'
          });
          
          if (refetchFaturas) {
            refetchFaturas();
          }
        }
      } catch (error) {
        console.error("Erro ao atualizar status da fatura:", error);
      }
    }
  }, [fatura, updateFaturaStatus, refetchFaturas]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={formState.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="consumo_kwh">Consumo (kWh)</Label>
              <input
                type="number"
                id="consumo_kwh"
                className="w-full h-10 p-2 border rounded-md"
                defaultValue={fatura?.consumo_kwh}
                {...formState.register("consumo_kwh")}
              />
              {formState.formState.errors.consumo_kwh && (
                <p className="text-red-500 text-xs mt-1">
                  {String(formState.formState.errors.consumo_kwh.message)}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="data_vencimento">Data de Vencimento</Label>
              <input
                type="date"
                id="data_vencimento"
                className="w-full h-10 p-2 border rounded-md"
                defaultValue={fatura?.data_vencimento}
                {...formState.register("data_vencimento")}
              />
              {formState.formState.errors.data_vencimento && (
                <p className="text-red-500 text-xs mt-1">
                  {String(formState.formState.errors.data_vencimento.message)}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_fatura">Total da Fatura</Label>
              <input
                type="number"
                id="total_fatura"
                className="w-full h-10 p-2 border rounded-md"
                value={localTotalFatura}
                onChange={(e) => setLocalTotalFatura(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="iluminacao_publica">Iluminação Pública</Label>
              <input
                type="number"
                id="iluminacao_publica"
                className="w-full h-10 p-2 border rounded-md"
                value={localIluminacaoPublica}
                onChange={(e) => setLocalIluminacaoPublica(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="outros_valores">Outros Valores</Label>
              <input
                type="number"
                id="outros_valores"
                className="w-full h-10 p-2 border rounded-md"
                value={localOutrosValores}
                onChange={(e) => setLocalOutrosValores(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="fatura_concessionaria">Fatura Concessionária</Label>
              <input
                type="number"
                id="fatura_concessionaria"
                className="w-full h-10 p-2 border rounded-md"
                value={localFaturaConcessionaria}
                onChange={(e) => setLocalFaturaConcessionaria(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor_desconto">Valor Desconto</Label>
              <input
                type="number"
                id="valor_desconto"
                className="w-full h-10 p-2 border rounded-md"
                value={localValorDesconto}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="valor_assinatura">Valor Assinatura</Label>
              <input
                type="number"
                id="valor_assinatura"
                className="w-full h-10 p-2 border rounded-md"
                value={localValorAssinatura}
                readOnly
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="economia_acumulada">Economia Acumulada</Label>
              <input
                type="number"
                id="economia_acumulada"
                className="w-full h-10 p-2 border rounded-md"
                defaultValue={fatura?.economia_acumulada}
                {...formState.register("economia_acumulada")}
              />
              {formState.formState.errors.economia_acumulada && (
                <p className="text-red-500 text-xs mt-1">
                  {String(formState.formState.errors.economia_acumulada.message)}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="saldo_energia_kwh">Saldo Energia (kWh)</Label>
              <input
                type="number"
                id="saldo_energia_kwh"
                className="w-full h-10 p-2 border rounded-md"
                defaultValue={fatura?.saldo_energia_kwh}
                {...formState.register("saldo_energia_kwh")}
              />
              {formState.formState.errors.saldo_energia_kwh && (
                <p className="text-red-500 text-xs mt-1">
                  {String(formState.formState.errors.saldo_energia_kwh.message)}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="observacao">Observação</Label>
            <textarea
              id="observacao"
              className="w-full h-20 p-2 border rounded-md"
              defaultValue={fatura?.observacao}
              {...formState.register("observacao")}
            />
            {formState.formState.errors.observacao && (
              <p className="text-red-500 text-xs mt-1">
                {String(formState.formState.errors.observacao.message)}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-6 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Documento da Concessionária</CardTitle>
                <CardDescription>
                  Anexe a fatura da concessionária para complementar os dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FaturaUploadArea 
                  faturaId={fatura.id}
                  initialFile={{
                    nome: arquivoInfo.nome,
                    path: arquivoInfo.path,
                    tipo: arquivoInfo.tipo,
                    tamanho: arquivoInfo.tamanho
                  }}
                  onFileChange={handleFileChange}
                  onStatusUpdate={handleStatusUpdate} // Novo: passar callback para sugestão de atualização de status
                  refetchFaturas={refetchFaturas}
                />
              </CardContent>
            </Card>
          </div>
  
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isProcessing || isCalculating}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCalcularClick}
              disabled={isProcessing || isCalculating}
            >
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculando...
                </>
              ) : (
                'Calcular Valores'
              )}
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || isCalculating || !formState.formState.isValid}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
