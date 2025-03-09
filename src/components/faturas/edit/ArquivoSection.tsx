
/**
 * Componente de seção para gerenciamento de arquivos de faturas
 * Este componente permite o upload, visualização e remoção de arquivos PDF
 * associados a faturas de concessionárias
 */

import { FormLabel } from "@/components/ui/form";
import { FaturaFileUpload } from "../FaturaFileUpload";
import { toast } from "sonner";
import { useEffect } from "react";

interface ArquivoSectionProps {
  faturaId: string;
  arquivoNome: string | null;
  arquivoPath: string | null;
  arquivoTipo: string | null;
  arquivoTamanho: number | null;
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  refetchFaturas?: () => void;
}

export function ArquivoSection({
  faturaId,
  arquivoNome,
  arquivoPath,
  arquivoTipo,
  arquivoTamanho,
  onFileChange,
  refetchFaturas,
}: ArquivoSectionProps) {
  
  // Log para debug
  useEffect(() => {
    console.log("[ArquivoSection] Renderizando com arquivo:", arquivoNome);
  }, [arquivoNome]);

  const handleSuccess = () => {
    toast.success("Arquivo atualizado com sucesso");
    
    // Forçar atualização dos dados após operação
    if (refetchFaturas) {
      console.log("[ArquivoSection] Tentando atualizar dados após operação bem-sucedida");
      refetchFaturas();
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Fatura da Concessionária (PDF)</FormLabel>
      <FaturaFileUpload 
        faturaId={faturaId}
        arquivoNome={arquivoNome}
        arquivoPath={arquivoPath}
        arquivoTipo={arquivoTipo}
        arquivoTamanho={arquivoTamanho}
        onSuccess={handleSuccess}
        onFileChange={onFileChange}
        refetchFaturas={refetchFaturas}
      />
    </div>
  );
}
