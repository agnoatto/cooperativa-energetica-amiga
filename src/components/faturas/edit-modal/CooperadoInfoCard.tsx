
import { formatarDocumento } from "@/utils/formatters";

interface CooperadoInfoCardProps {
  nome: string;
  documento: string;
  numeroUC: string;
  apelido: string | null;
}

export function CooperadoInfoCard({ nome, documento, numeroUC, apelido }: CooperadoInfoCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-gray-900">{nome}</span>
        <div className="text-sm text-gray-500 space-x-2">
          <span>{formatarDocumento(documento)}</span>
          <span>•</span>
          <span>
            UC: {numeroUC}
            {apelido && (
              <span className="text-gray-400 ml-1">({apelido})</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
