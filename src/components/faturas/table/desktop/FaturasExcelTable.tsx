import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Button } from "@/components/ui/button";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { FileText } from "lucide-react";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { FaturaRowActions } from "../FaturaRowActions";
import { formatarDocumento } from "@/utils/formatters";

interface FaturasExcelTableProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onShowPaymentModal: () => void;
  onViewPdf: () => void;
}

const columns = [
  {
    id: 'cooperado',
    label: 'Cooperado',
    width: 300,
    minWidth: 200
  },
  {
    id: 'documento',
    label: 'CNPJ/CPF',
    width: 180,
    minWidth: 150
  },
  {
    id: 'uc',
    label: 'Instalação',
    width: 150,
    minWidth: 120
  },
  {
    id: 'vencimento',
    label: 'Data Vencimento',
    width: 150,
    minWidth: 120
  },
  {
    id: 'consumo',
    label: 'Consumo (kWh)',
    width: 150,
    minWidth: 120
  },
  {
    id: 'valor_original',
    label: 'Valor Original',
    width: 150,
    minWidth: 120
  },
  {
    id: 'valor_assinatura',
    label: 'Valor da Assinatura',
    width: 150,
    minWidth: 120
  },
  {
    id: 'status',
    label: 'Status',
    width: 130,
    minWidth: 100
  },
  {
    id: 'acoes',
    label: 'Ações',
    width: 120,
    minWidth: 100
  }
];

export function FaturasExcelTable({
  faturas,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onShowPaymentModal,
  onViewPdf
}: FaturasExcelTableProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <ExcelTable
      columns={columns}
      storageKey="faturas-table-config"
      stickyHeader
    >
      <tbody>
        {faturas.map((fatura) => (
          <tr key={fatura.id} className="border-b hover:bg-gray-50 transition-colors text-sm">
            <td className="px-2 py-1 whitespace-nowrap">
              <span className="text-gray-900">
                {fatura.unidade_beneficiaria.cooperado.nome}
              </span>
              {fatura.unidade_beneficiaria.apelido && (
                <span className="text-gray-400 ml-1">
                  ({fatura.unidade_beneficiaria.apelido})
                </span>
              )}
            </td>
            <td className="px-2 py-1 whitespace-nowrap text-gray-600">
              {formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}
            </td>
            <td className="px-2 py-1 whitespace-nowrap text-gray-600">
              {fatura.unidade_beneficiaria.numero_uc}
            </td>
            <td className="px-2 py-1 whitespace-nowrap">
              {formatDateToPtBR(fatura.data_vencimento)}
            </td>
            <td className="px-2 py-1 text-right whitespace-nowrap">
              {fatura.consumo_kwh} kWh
            </td>
            <td className="px-2 py-1 text-right whitespace-nowrap font-mono">
              {formatCurrency(fatura.total_fatura)}
            </td>
            <td className="px-2 py-1 text-right whitespace-nowrap font-mono">
              {formatCurrency(fatura.valor_assinatura)}
              {fatura.valor_adicional > 0 && (
                <span className="text-yellow-600 text-xs ml-1">
                  +{formatCurrency(fatura.valor_adicional)}
                </span>
              )}
            </td>
            <td className="px-2 py-1 whitespace-nowrap">
              <FaturaStatusBadge fatura={fatura} />
            </td>
            <td className="px-2 py-1 text-right whitespace-nowrap">
              <FaturaRowActions
                fatura={fatura}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateStatus={onUpdateStatus}
                onShowPaymentModal={onShowPaymentModal}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </ExcelTable>
  );
}
