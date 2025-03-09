
import { FormLabel } from "@/components/ui/form";
import { FaturaFileUpload } from "../FaturaFileUpload";
import { toast } from "sonner";

interface ArquivoSectionProps {
  faturaId: string;
  arquivoNome: string | null;
  arquivoPath: string | null;
  arquivoTipo: string | null;
  arquivoTamanho: number | null;
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  refetchFaturas?: () => void; // Nova prop para refetch
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
  return (
    <div className="space-y-2">
      <FormLabel>Fatura da Concessionária (PDF)</FormLabel>
      <FaturaFileUpload 
        faturaId={faturaId}
        arquivoNome={arquivoNome}
        arquivoPath={arquivoPath}
        arquivoTipo={arquivoTipo}
        arquivoTamanho={arquivoTamanho}
        onSuccess={() => toast.success("Arquivo atualizado com sucesso")}
        onFileChange={onFileChange}
        refetchFaturas={refetchFaturas}
      />
    </div>
  );
}
