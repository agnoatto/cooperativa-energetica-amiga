
/**
 * Modal para edição de faturas
 * 
 * Este componente permite a edição completa de uma fatura, incluindo valores,
 * datas, arquivos e outras informações relacionadas. Utiliza hooks e componentes
 * menores para organizar a lógica e interface do usuário.
 * 
 * Implementa restrição de edição para faturas que já foram enviadas, permitindo
 * alterações apenas após mudar o status para "corrigida".
 */
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useEditFatura } from "./edit/hooks/useEditFatura";
import { BasicInfoSection } from "./edit/BasicInfoSection";
import { FaturaValoresSection } from "./edit/FaturaValoresSection";
import { DescontoAssinaturaSection } from "./edit/DescontoAssinaturaSection";
import { ObservacaoSection } from "./edit/ObservacaoSection";
import { ArquivoSection } from "./edit/ArquivoSection";
import { ActionButtons } from "./edit/ActionButtons";
import { ModalHeader } from "./edit/ModalHeader";
import { convertLocalToUTC } from "@/utils/dateFormatters";
import { StatusTransitionButtons } from "./StatusTransitionButtons";
import { FaturaStatus } from "@/types/fatura";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface EditFaturaModalProps {
  fatura: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isProcessing: boolean;
  refetchFaturas?: () => void;
  onUpdateStatus?: (fatura: any, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function EditFaturaModal({
  fatura,
  isOpen,
  onClose,
  onSave,
  isProcessing,
  refetchFaturas,
  onUpdateStatus
}: EditFaturaModalProps) {
  // Usar o hook personalizado para gerenciar o estado e a lógica
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
  } = useEditFatura(fatura, async (data) => {
    // Converter a data de vencimento para UTC antes de salvar
    const dataFormatada = {
      ...data,
      data_vencimento: convertLocalToUTC(data.data_vencimento)
    };
    await onSave(dataFormatada);
    onClose();
  }, refetchFaturas);

  // Verificar se a fatura está em um estado que não permite edição
  const statusBloqueados: FaturaStatus[] = ['enviada', 'reenviada', 'atrasada', 'paga', 'finalizada'];
  const isReadOnly = statusBloqueados.includes(fatura.status as FaturaStatus);
  
  // Verificar se a fatura está em um estado gerenciado pelo financeiro
  const isFinancialStatus = ['paga', 'finalizada'].includes(fatura.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <ModalHeader fatura={fatura} />

        {isReadOnly && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta fatura não pode ser editada pois já foi enviada ao cliente. 
              Para realizar alterações, primeiro marque-a como "Corrigida".
            </AlertDescription>
          </Alert>
        )}

        {isFinancialStatus && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              Esta fatura está com status <strong>{fatura.status}</strong>. As alterações de status após o pagamento 
              são gerenciadas pelo módulo Financeiro no menu "Contas a Receber".
            </AlertDescription>
          </Alert>
        )}

        {isReadOnly && onUpdateStatus && !isFinancialStatus && (
          <div className="mb-4">
            <StatusTransitionButtons 
              fatura={fatura}
              onUpdateStatus={onUpdateStatus}
              size="sm"
              direction="row"
              className="justify-center"
            />
          </div>
        )}

        <Form {...formState}>
          <form onSubmit={formState.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicInfoSection 
              formState={formState} 
              readOnly={isReadOnly}
            />
            
            <FaturaValoresSection 
              formState={formState}
              localTotalFatura={localTotalFatura}
              setLocalTotalFatura={setLocalTotalFatura}
              localFaturaConcessionaria={localFaturaConcessionaria}
              setLocalFaturaConcessionaria={setLocalFaturaConcessionaria}
              localIluminacaoPublica={localIluminacaoPublica}
              setLocalIluminacaoPublica={setLocalIluminacaoPublica}
              localOutrosValores={localOutrosValores}
              setLocalOutrosValores={setLocalOutrosValores}
              readOnly={isReadOnly}
            />
            
            <DescontoAssinaturaSection 
              formState={formState}
              localValorDesconto={localValorDesconto}
              setLocalValorDesconto={setLocalValorDesconto}
              localValorAssinatura={localValorAssinatura}
              setLocalValorAssinatura={setLocalValorAssinatura}
              isCalculating={isCalculating}
              onCalcularClick={handleCalcularClick}
              readOnly={isReadOnly}
            />
            
            <ObservacaoSection formState={formState} readOnly={isReadOnly} />
            
            <ArquivoSection 
              faturaId={fatura.id}
              arquivoNome={arquivoInfo.nome}
              arquivoPath={arquivoInfo.path}
              arquivoTipo={arquivoInfo.tipo}
              arquivoTamanho={arquivoInfo.tamanho}
              onFileChange={handleFileChange}
              refetchFaturas={refetchFaturas}
              readOnly={isReadOnly}
            />
            
            <ActionButtons 
              onClose={onClose} 
              isProcessing={isProcessing} 
              disabled={isReadOnly}
              disabledMessage="Altere o status para 'Corrigida' para habilitar a edição"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
