
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
import { useEffect, useState } from "react";
import { calculateValues } from "./utils/calculateValues";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoSection } from "./edit/BasicInfoSection";
import { FaturaValoresSection } from "./edit/FaturaValoresSection";
import { DescontoAssinaturaSection } from "./edit/DescontoAssinaturaSection";
import { ObservacaoSection } from "./edit/ObservacaoSection";
import { ArquivoSection } from "./edit/ArquivoSection";
import { ActionButtons } from "./edit/ActionButtons";
import { convertLocalToUTC, convertUTCToLocal } from "@/utils/dateFormatters";

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
  data_vencimento: z.string().min(1, { message: "Data de vencimento é obrigatória" }),
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
  
  // Usando números para todos os valores monetários
  const [localTotalFatura, setLocalTotalFatura] = useState(Number(fatura?.total_fatura) || 0);
  const [localIluminacaoPublica, setLocalIluminacaoPublica] = useState(Number(fatura?.iluminacao_publica) || 0);
  const [localOutrosValores, setLocalOutrosValores] = useState(Number(fatura?.outros_valores) || 0);
  const [localFaturaConcessionaria, setLocalFaturaConcessionaria] = useState(Number(fatura?.fatura_concessionaria) || 0);
  const [localValorDesconto, setLocalValorDesconto] = useState(Number(fatura?.valor_desconto) || 0);
  const [localValorAssinatura, setLocalValorAssinatura] = useState(Number(fatura?.valor_assinatura) || 0);
  
  useEffect(() => {
    if (fatura) {
      setArquivoInfo({
        nome: fatura.arquivo_concessionaria_nome || null,
        path: fatura.arquivo_concessionaria_path || null,
        tipo: fatura.arquivo_concessionaria_tipo || null,
        tamanho: fatura.arquivo_concessionaria_tamanho || null
      });
      
      // Inicializar valores com conversão para Number
      setLocalTotalFatura(Number(fatura.total_fatura) || 0);
      setLocalIluminacaoPublica(Number(fatura.iluminacao_publica) || 0);
      setLocalOutrosValores(Number(fatura.outros_valores) || 0);
      setLocalFaturaConcessionaria(Number(fatura.fatura_concessionaria) || 0);
      setLocalValorDesconto(Number(fatura.valor_desconto) || 0);
      setLocalValorAssinatura(Number(fatura.valor_assinatura) || 0);
    }
  }, [fatura]);
  
  const handleCalcularClick = async () => {
    if (!fatura) return;
    
    setIsCalculating(true);
    try {
      console.log("[EditFaturaModal] Valores antes do cálculo:", {
        totalFatura: localTotalFatura,
        iluminacaoPublica: localIluminacaoPublica,
        outrosValores: localOutrosValores,
        faturaConcessionaria: localFaturaConcessionaria
      });
      
      // Buscar percentual de desconto da unidade - este já vem como número
      const { data: unidade, error } = await supabase
        .from('unidades_beneficiarias')
        .select('percentual_desconto')
        .eq('id', fatura.unidade_beneficiaria.id)
        .single();
      
      if (error) throw error;
      
      // O percentual já vem como número da consulta SQL
      const percentualDesconto = unidade?.percentual_desconto || 0;
      console.log("[EditFaturaModal] Percentual de desconto da unidade:", percentualDesconto);
      
      // Calcula os valores usando números diretamente
      const valores = await calculateValues({
        totalFatura: localTotalFatura,
        iluminacaoPublica: localIluminacaoPublica,
        outrosValores: localOutrosValores,
        faturaConcessionaria: localFaturaConcessionaria,
        percentualDesconto: percentualDesconto,
        unidadeBeneficiariaId: fatura.unidade_beneficiaria.id
      });
      
      console.log("[EditFaturaModal] Valores calculados:", valores);
      
      // Define os valores calculados como números
      setLocalValorDesconto(valores.valorDesconto);
      setLocalValorAssinatura(valores.valorAssinatura);
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
      data_vencimento: fatura?.data_vencimento ? convertUTCToLocal(fatura.data_vencimento) : "",
      economia_acumulada: fatura?.economia_acumulada.toString() || "0",
      saldo_energia_kwh: fatura?.saldo_energia_kwh.toString() || "0",
      observacao: fatura?.observacao || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (fatura) {
      formState.reset({
        consumo_kwh: fatura.consumo_kwh.toString() || "0",
        data_vencimento: fatura.data_vencimento ? convertUTCToLocal(fatura.data_vencimento) : "",
        economia_acumulada: fatura.economia_acumulada.toString() || "0",
        saldo_energia_kwh: fatura.saldo_energia_kwh.toString() || "0",
        observacao: fatura.observacao || "",
      });
    }
  }, [fatura, formState]);

  const handleFileChange = (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => {
    console.log("[EditFaturaModal] Atualizando arquivo:", { nome, path, tipo, tamanho });
    setArquivoInfo({
      nome,
      path,
      tipo,
      tamanho
    });
    
    if (refetchFaturas) {
      console.log("[EditFaturaModal] Chamando refetchFaturas após alteração de arquivo");
      setTimeout(() => refetchFaturas(), 100);
    }
  };

  const handleSubmit = async (values: any) => {
    console.log("[EditFaturaModal] Submetendo formulário com valores:", {
      localValorAssinatura,
      localValorDesconto,
      localTotalFatura,
      localFaturaConcessionaria,
      localIluminacaoPublica,
      localOutrosValores,
      values
    });
    
    const data = {
      id: fatura.id,
      consumo_kwh: Number(values.consumo_kwh),
      valor_assinatura: localValorAssinatura,
      data_vencimento: convertLocalToUTC(values.data_vencimento),
      fatura_concessionaria: localFaturaConcessionaria,
      total_fatura: localTotalFatura,
      iluminacao_publica: localIluminacaoPublica,
      outros_valores: localOutrosValores,
      valor_desconto: localValorDesconto,
      economia_acumulada: Number(values.economia_acumulada),
      saldo_energia_kwh: Number(values.saldo_energia_kwh),
      observacao: values.observacao,
      arquivo_concessionaria_nome: arquivoInfo.nome,
      arquivo_concessionaria_path: arquivoInfo.path,
      arquivo_concessionaria_tipo: arquivoInfo.tipo,
      arquivo_concessionaria_tamanho: arquivoInfo.tamanho
    };

    console.log("[EditFaturaModal] Dados finais para salvar:", data);
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
