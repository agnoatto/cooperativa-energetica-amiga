
/**
 * Modal para edição de faturas
 * 
 * Este componente permite a edição completa de uma fatura, incluindo valores,
 * datas, arquivos e outras informações relacionadas. Utiliza hooks e componentes
 * menores para organizar a lógica e interface do usuário.
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

interface EditFaturaModalProps {
  fatura: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <ModalHeader />

        <Form {...formState}>
          <form onSubmit={formState.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicInfoSection 
              formState={formState} 
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
            />
            
            <DescontoAssinaturaSection 
              formState={formState}
              localValorDesconto={localValorDesconto}
              setLocalValorDesconto={setLocalValorDesconto}
              localValorAssinatura={localValorAssinatura}
              setLocalValorAssinatura={setLocalValorAssinatura}
              isCalculating={isCalculating}
              onCalcularClick={handleCalcularClick}
            />
            
            <ObservacaoSection formState={formState} />
            
            <ArquivoSection 
              faturaId={fatura.id}
              arquivoNome={arquivoInfo.nome}
              arquivoPath={arquivoInfo.path}
              arquivoTipo={arquivoInfo.tipo}
              arquivoTamanho={arquivoInfo.tamanho}
              onFileChange={handleFileChange}
              refetchFaturas={refetchFaturas}
            />
            
            <ActionButtons 
              onClose={onClose} 
              isProcessing={isProcessing} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
