
/**
 * Componente para renderização do conteúdo das células da tabela
 * 
 * Este componente gerencia o conteúdo a ser exibido em cada célula
 * com base no identificador da coluna e nos dados da fatura.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { formatarDocumento } from "@/utils/formatters";
import { FaturaStatusBadge } from "../../FaturaStatusBadge";
import { FaturaActionsMenu } from "../../FaturaActionsMenu";
import { NumeroUC } from "./NumeroUC";
import { ConsumoKwh } from "./ConsumoKwh";
import { DataVencimento } from "./DataVencimento";
import { formatCurrency } from "../utils/formatters";
import { cn } from "@/lib/utils";
import { AcoesRapidas } from "./AcoesRapidas";

interface TableCellContentProps {
  columnId: string;
  fatura: Fatura;
  colIndex: number;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf: () => void;
}

export function TableCellContent({
  columnId,
  fatura,
  colIndex,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewPdf
}: TableCellContentProps) {
  return (
    <td 
      key={columnId} 
      className={cn(
        "px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis",
        colIndex === 0 && "sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" // Célula da primeira coluna fixa
      )}
      onClick={(e) => columnId === 'acoes' && e.stopPropagation()}
    >
      {columnId === 'cooperado' && (
        <span className="text-gray-900">
          {fatura.unidade_beneficiaria.cooperado.nome}
          {fatura.unidade_beneficiaria.apelido && (
            <span className="text-gray-400 ml-1">
              ({fatura.unidade_beneficiaria.apelido})
            </span>
          )}
        </span>
      )}
      
      {columnId === 'documento' && formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}
      
      {columnId === 'uc' && <NumeroUC numeroUC={fatura.unidade_beneficiaria.numero_uc} />}
      
      {columnId === 'vencimento' && <DataVencimento dataVencimento={fatura.data_vencimento} />}
      
      {columnId === 'consumo' && <ConsumoKwh consumoKwh={fatura.consumo_kwh} />}
      
      {columnId === 'valor_original' && formatCurrency(fatura.total_fatura)}
      
      {columnId === 'valor_assinatura' && (
        <>
          {formatCurrency(fatura.valor_assinatura)}
          {fatura.valor_adicional > 0 && (
            <span className="text-yellow-600 text-xs ml-1">
              +{formatCurrency(fatura.valor_adicional)}
            </span>
          )}
        </>
      )}
      
      {columnId === 'status' && <FaturaStatusBadge fatura={fatura} />}
      
      {columnId === 'acoes_rapidas' && (
        <AcoesRapidas 
          fatura={fatura}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onUpdateStatus={onUpdateStatus}
        />
      )}
      
      {columnId === 'acoes' && (
        <FaturaActionsMenu
          fatura={fatura}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </td>
  );
}
