
/**
 * Componente de modal para edição de pagamentos de usinas
 * 
 * Este componente permite editar informações de um pagamento específico,
 * como geração de energia, valores, datas de vencimento e emissão.
 * Calcula automaticamente valores derivados baseados na entrada do usuário.
 */
import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { convertLocalToUTC } from "@/utils/dateFormatters";
import { PagamentoData } from "./types/pagamento";
import { usePagamentoForm } from "./hooks/usePagamentoForm";

// Componentes refatorados
import { DadosUsinaSection } from "./modal/DadosUsinaSection";
import { GeracaoValoresSection } from "./modal/GeracaoValoresSection";
import { DatasSection } from "./modal/DatasSection";
import { FormButtons } from "./modal/FormButtons";
import { ArquivoContaSection } from "./modal/ArquivoContaSection";
import { ObservacaoSection } from "./modal/ObservacaoSection";

interface PagamentoEditModalProps {
  pagamento: PagamentoData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  onSuccess?: () => void; // Adicionar propriedade onSuccess como alternativa
}

export function PagamentoEditModal({ pagamento, isOpen, onClose, onSave, onSuccess }: PagamentoEditModalProps) {
  // Estados locais para os campos do formulário
  const [geracao, setGeracao] = useState<number>(0);
  const [valorKwh, setValorKwh] = useState<number>(0);
  const [tusdFioB, setTusdFioB] = useState<number>(0);
  const [valorTusdFioB, setValorTusdFioB] = useState<number>(0);
  const [valorBruto, setValorBruto] = useState<number>(0);
  const [valorConcessionaria, setValorConcessionaria] = useState<number>(0);
  const [dataVencimentoConcessionaria, setDataVencimentoConcessionaria] = useState<Date | undefined>();
  const [dataEmissao, setDataEmissao] = useState<Date | undefined>();
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>();
  const [observacao, setObservacao] = useState<string>("");
  
  // Estado para o arquivo da conta de energia
  const [arquivoContaNome, setArquivoContaNome] = useState<string | null>(null);
  const [arquivoContaPath, setArquivoContaPath] = useState<string | null>(null);
  const [arquivoContaTipo, setArquivoContaTipo] = useState<string | null>(null);
  const [arquivoContaTamanho, setArquivoContaTamanho] = useState<number | null>(null);
  
  // Custom hook para manipular o formulário
  const { salvarPagamento, isSaving } = usePagamentoForm();

  // Resetar campos quando o pagamento mudar ou o modal abrir
  useEffect(() => {
    if (pagamento && isOpen) {
      console.log("[PagamentoEditModal] Carregando dados do pagamento:", pagamento);
      setGeracao(pagamento.geracao_kwh);
      setValorKwh(pagamento.usina?.valor_kwh || 0);
      setTusdFioB(pagamento.tusd_fio_b);
      setValorTusdFioB(pagamento.valor_tusd_fio_b);
      setValorConcessionaria(pagamento.valor_concessionaria);
      setObservacao(pagamento.observacao || "");
      
      // Calcular valor bruto
      const calculoValorBruto = pagamento.geracao_kwh * (pagamento.usina?.valor_kwh || 0);
      setValorBruto(calculoValorBruto);
      
      // Converter datas
      if (pagamento.data_vencimento_concessionaria) {
        setDataVencimentoConcessionaria(new Date(pagamento.data_vencimento_concessionaria));
      }
      
      if (pagamento.data_emissao) {
        setDataEmissao(new Date(pagamento.data_emissao));
      }
      
      if (pagamento.data_vencimento) {
        setDataVencimento(new Date(pagamento.data_vencimento));
      }
      
      // Definir informações do arquivo de conta de energia
      setArquivoContaNome(pagamento.arquivo_conta_energia_nome);
      setArquivoContaPath(pagamento.arquivo_conta_energia_path);
      setArquivoContaTipo(pagamento.arquivo_conta_energia_tipo);
      setArquivoContaTamanho(pagamento.arquivo_conta_energia_tamanho);
    }
  }, [pagamento, isOpen]);

  // Calcula o valor da TUSD Fio B com base na geração e TUSD
  useEffect(() => {
    const calculoValorTusdFioB = geracao * tusdFioB;
    setValorTusdFioB(calculoValorTusdFioB);
  }, [geracao, tusdFioB]);

  // Calcula o valor bruto a receber com base na geração e valor do kWh
  useEffect(() => {
    const calculoValorBruto = geracao * valorKwh;
    setValorBruto(calculoValorBruto);
  }, [geracao, valorKwh]);

  // Calcula a data de vencimento como 90 dias após a data de emissão
  useEffect(() => {
    if (dataEmissao) {
      const novaDataVencimento = addDays(dataEmissao, 90);
      setDataVencimento(novaDataVencimento);
    }
  }, [dataEmissao]);

  // Função para lidar com alterações nos arquivos
  const handleFileChange = (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => {
    console.log("[PagamentoEditModal] Arquivo alterado:", { nome, path, tipo, tamanho });
    setArquivoContaNome(nome);
    setArquivoContaPath(path);
    setArquivoContaTipo(tipo);
    setArquivoContaTamanho(tamanho);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pagamento) {
      toast.error("Dados do pagamento não encontrados");
      return;
    }
    
    try {
      // Calcular valor total (valor bruto - valor TUSD FioB - valor concessionária)
      const valorTotal = valorBruto - valorTusdFioB - valorConcessionaria;
      
      // Preparar dados para salvar
      const dadosAtualizados = {
        id: pagamento.id,
        geracao_kwh: geracao,
        tusd_fio_b: tusdFioB,
        valor_tusd_fio_b: valorTusdFioB,
        valor_concessionaria: valorConcessionaria,
        valor_total: valorTotal,
        data_vencimento_concessionaria: dataVencimentoConcessionaria ? convertLocalToUTC(dataVencimentoConcessionaria.toISOString()) : null,
        data_emissao: dataEmissao ? convertLocalToUTC(dataEmissao.toISOString()) : null,
        data_vencimento: dataVencimento ? convertLocalToUTC(dataVencimento.toISOString()) : null,
        arquivo_conta_energia_nome: arquivoContaNome,
        arquivo_conta_energia_path: arquivoContaPath,
        arquivo_conta_energia_tipo: arquivoContaTipo,
        arquivo_conta_energia_tamanho: arquivoContaTamanho,
        observacao: observacao
      };
      
      console.log("[PagamentoEditModal] Salvando dados:", dadosAtualizados);
      
      await salvarPagamento(dadosAtualizados);
      toast.success("Pagamento atualizado com sucesso");
      
      // Chamar callback de sucesso - suporta ambos onSave e onSuccess para compatibilidade
      if (onSave) onSave();
      if (onSuccess) onSuccess();
      
      onClose();
    } catch (error: any) {
      console.error("[PagamentoEditModal] Erro ao salvar pagamento:", error);
      toast.error(`Erro ao atualizar pagamento: ${error.message || "Erro desconhecido"}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Pagamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Informações da Usina */}
            <DadosUsinaSection pagamento={pagamento} />
            
            {/* Seção de Geração e Valores (agora ocupa 2 colunas) */}
            <GeracaoValoresSection 
              geracao={geracao}
              setGeracao={setGeracao}
              valorKwh={valorKwh}
              tusdFioB={tusdFioB}
              setTusdFioB={setTusdFioB}
              valorTusdFioB={valorTusdFioB}
              valorBruto={valorBruto}
              valorConcessionaria={valorConcessionaria}
              setValorConcessionaria={setValorConcessionaria}
            />
            
            {/* Seção de Datas (ocupa 2 colunas para manter o alinhamento) */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatasSection 
                dataVencimentoConcessionaria={dataVencimentoConcessionaria}
                setDataVencimentoConcessionaria={setDataVencimentoConcessionaria}
                dataEmissao={dataEmissao}
                setDataEmissao={setDataEmissao}
                dataVencimento={dataVencimento}
              />
            </div>
            
            {/* Seção de Observações */}
            <div className="col-span-2">
              <ObservacaoSection 
                observacao={observacao}
                setObservacao={setObservacao}
              />
            </div>
            
            {/* Seção de Upload da Conta de Energia */}
            {pagamento && (
              <ArquivoContaSection
                pagamentoId={pagamento.id}
                arquivoNome={arquivoContaNome}
                arquivoPath={arquivoContaPath}
                arquivoTipo={arquivoContaTipo}
                arquivoTamanho={arquivoContaTamanho}
                onFileChange={handleFileChange}
              />
            )}
          </div>
          
          {/* Botões do Formulário */}
          <FormButtons onClose={onClose} isSaving={isSaving} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
