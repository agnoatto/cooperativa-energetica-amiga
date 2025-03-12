
/**
 * Componente de seção para gerenciamento de arquivos de contas de energia
 * 
 * Este componente permite o upload, visualização e remoção de arquivos PDF
 * de contas de energia associadas aos pagamentos de usinas
 */
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { ContaEnergiaUpload } from "../upload/ContaEnergiaUpload";

interface ArquivoContaSectionProps {
  pagamentoId: string;
  arquivoNome: string | null;
  arquivoPath: string | null;
  arquivoTipo: string | null;
  arquivoTamanho: number | null;
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
}

export function ArquivoContaSection({
  pagamentoId,
  arquivoNome,
  arquivoPath,
  arquivoTipo,
  arquivoTamanho,
  onFileChange
}: ArquivoContaSectionProps) {
  // Log para debug inicial
  useEffect(() => {
    console.log("[ArquivoContaSection] Renderizando com arquivo:", arquivoNome);
    console.log("[ArquivoContaSection] Path do arquivo:", arquivoPath);
  }, [arquivoNome, arquivoPath]);

  return (
    <div className="space-y-2 col-span-2">
      <Label htmlFor="conta-energia">Conta de Energia (PDF)</Label>
      <ContaEnergiaUpload
        pagamentoId={pagamentoId}
        arquivoNome={arquivoNome}
        arquivoPath={arquivoPath}
        arquivoTipo={arquivoTipo}
        arquivoTamanho={arquivoTamanho}
        onFileChange={onFileChange}
      />
    </div>
  );
}
