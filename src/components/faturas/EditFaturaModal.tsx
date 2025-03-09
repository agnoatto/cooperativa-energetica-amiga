import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { calculateValues } from "./utils/calculateValues";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoSection } from "./edit/BasicInfoSection";
import { FaturaValoresSection } from "./edit/FaturaValoresSection";
import { DescontoAssinaturaSection } from "./edit/DescontoAssinaturaSection";
import { ObservacaoSection } from "./edit/ObservacaoSection";
import { ArquivoSection } from "./edit/ArquivoSection";
import { ActionButtons } from "./edit/ActionButtons";

interface EditFaturaModalProps {
  fatura: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isProcessing: boolean;
  refetchFaturas?: () => void;
}

const formSchema = z.object({
  consumo_kwh: z.string().min(1, { message: "Consumo é obrigatório" }),
  valor_assinatura: z.string().min(1, { message: "Valor da assinatura é obrigatório" }),
  data_vencimento: z.string().min(1, { message: "Data de vencimento é obrigatória" }),
  fatura_concessionaria: z.string().min(1, { message: "Valor da concessionária é obrigatório" }),
  total_fatura: z.string().min(1, { message: "Total da fatura é obrigatório" }),
  iluminacao_publica: z.string().min(1, { message: "Iluminação pública é obrigatória" }),
  outros_valores: z.string().min(1, { message: "Outros valores são obrigatórios" }),
  valor_desconto: z.string().optional(),
  economia_acumulada: z.string().optional(),
  saldo_energia_kwh: z.string().optional(),
  observacao: z.string().optional(),
});

export function EditFaturaModal({
  fatura,
  isOpen,
  onClose,
  onSave,
  isProcessing,
  refetchFaturas
}: EditFaturaModalProps & { refetchFaturas?: () => void }) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [arquivoInfo, setArquivoInfo] = useState({
    nome: fatura?.arquivo_concessionaria_nome || null,
    path: fatura?.arquivo_concessionaria_path || null,
    tipo: fatura?.arquivo_concessionaria_tipo || null,
    tamanho: fatura?.arquivo_concessionaria_tamanho || null
  });
  
  const [localTotalFatura, setLocalTotalFatura] = useState(fatura?.total_fatura.toString() || "0");
  const [localIluminacaoPublica, setLocalIluminacaoPublica] = useState(fatura?.iluminacao_publica.toString() || "0");
  const [localOutrosValores, setLocalOutrosValores] = useState(fatura?.outros_valores.toString() || "0");
  const [localFaturaConcessionaria, setLocalFaturaConcessionaria] = useState(fatura?.fatura_concessionaria.toString() || "0");
  const [localValorDesconto, setLocalValorDesconto] = useState(fatura?.valor_desconto.toString() || "0");
  const [localValorAssinatura, setLocalValorAssinatura] = useState(fatura?.valor_assinatura.toString() || "0");
  
  const handleCalcularClick = async () => {
    if (!fatura) return;
    
    setIsCalculating(true);
    try {
      const { data: unidade, error } = await supabase
        .from('unidades_beneficiarias')
        .select('percentual_desconto')
        .eq('id', fatura.unidade_beneficiaria.id)
        .single();
      
      if (error) throw error;
      
      const percentualDesconto = unidade?.percentual_desconto || 0;
      
      const valores = await calculateValues({
        totalFatura: localTotalFatura,
        iluminacaoPublica: localIluminacaoPublica,
        outrosValores: localOutrosValores,
        faturaConcessionaria: localFaturaConcessionaria,
        percentualDesconto: percentualDesconto,
        unidadeBeneficiariaId: fatura.unidade_beneficiaria.id
      });
      
      setLocalValorDesconto(valores.valorDesconto.toString());
      setLocalValorAssinatura(valores.valorAssinatura.toString());
    } catch (error) {
      console.error('Erro ao calcular valores:', error);
      toast.error('Erro ao calcular valores. Verifique o console para mais detalhes.');
    } finally {
      setIsCalculating(false);
    }
  };

  const formState = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consumo_kwh: fatura?.consumo_kwh.toString() || "0",
      valor_assinatura: fatura?.valor_assinatura.toString() || "0",
      data_vencimento: fatura?.data_vencimento || "",
      fatura_concessionaria: fatura?.fatura_concessionaria.toString() || "0",
      total_fatura: fatura?.total_fatura.toString() || "0",
      iluminacao_publica: fatura?.iluminacao_publica.toString() || "0",
      outros_valores: fatura?.outros_valores.toString() || "0",
      valor_desconto: fatura?.valor_desconto.toString() || "0",
      economia_acumulada: fatura?.economia_acumulada.toString() || "0",
      saldo_energia_kwh: fatura?.saldo_energia_kwh.toString() || "0",
      observacao: fatura?.observacao || "",
    },
    mode: "onChange",
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleFileChange = (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => {
    setArquivoInfo({
      nome,
      path,
      tipo,
      tamanho
    });
  };

  const handleSubmit = async (values: any) => {
    const data = {
      id: fatura.id,
      consumo_kwh: Number(values.consumo_kwh),
      valor_assinatura: Number(localValorAssinatura),
      data_vencimento: formatDate(values.data_vencimento),
      fatura_concessionaria: Number(values.fatura_concessionaria),
      total_fatura: Number(values.total_fatura),
      iluminacao_publica: Number(values.iluminacao_publica),
      outros_valores: Number(values.outros_valores),
      valor_desconto: Number(localValorDesconto),
      economia_acumulada: Number(values.economia_acumulada),
      saldo_energia_kwh: Number(values.saldo_energia_kwh),
      observacao: values.observacao,
      arquivo_concessionaria_nome: arquivoInfo.nome,
      arquivo_concessionaria_path: arquivoInfo.path,
      arquivo_concessionaria_tipo: arquivoInfo.tipo,
      arquivo_concessionaria_tamanho: arquivoInfo.tamanho
    };

    await onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para atualizar os dados da fatura.
          </DialogDescription>
        </DialogHeader>

        <Form {...formState}>
          <form onSubmit={formState.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicInfoSection 
              formState={formState} 
              formatDate={formatDate} 
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
              arquivoNome={fatura.arquivo_concessionaria_nome}
              arquivoPath={fatura.arquivo_concessionaria_path}
              arquivoTipo={fatura.arquivo_concessionaria_tipo}
              arquivoTamanho={fatura.arquivo_concessionaria_tamanho}
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
