
import { Label } from "@/components/ui/label";
import { FaturaFileUpload } from "../../FaturaFileUpload";

interface ArquivoSectionProps {
  faturaId: string;
  arquivoConcessionariaNome: string | null | undefined;
  arquivoConcessionariaPath: string | null | undefined;
  arquivoConcessionariaTipo: string | null | undefined;
  arquivoConcessionariaTamanho: number | null | undefined;
  onSuccess: () => void;
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
}

export function ArquivoSection({
  faturaId,
  arquivoConcessionariaNome,
  arquivoConcessionariaPath,
  arquivoConcessionariaTipo,
  arquivoConcessionariaTamanho,
  onSuccess,
  onFileChange
}: ArquivoSectionProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label className="font-semibold">Conta de Energia (PDF)</Label>
      <FaturaFileUpload
        faturaId={faturaId}
        arquivoNome={arquivoConcessionariaNome}
        arquivoPath={arquivoConcessionariaPath}
        arquivoTipo={arquivoConcessionariaTipo}
        arquivoTamanho={arquivoConcessionariaTamanho}
        onSuccess={onSuccess}
        onFileChange={onFileChange}
      />
    </div>
  );
}
