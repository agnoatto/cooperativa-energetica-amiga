
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
    width: 250,
    minWidth: 180
  },
  {
    id: 'documento',
    label: 'CPF/CNPJ',
    width: 150,
    minWidth: 130
  },
  {
    id: 'uc',
    label: 'UC',
    width: 120,
    minWidth: 100
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
    id: 'conta_energia',
    label: 'Conta de Energia',
    width: 150,
    minWidth: 120
  },
  {
    id: 'desconto_percentual',
    label: 'Desconto (%)',
    width: 130,
    minWidth: 100
  },
  {
    id: 'valor_desconto',
    label: 'Valor Desconto',
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
    id: 'conta',
    label: 'Conta',
    width: 100,
    minWidth: 80
  },
  {
    id: 'acoes',
    label: 'Ações',
    width: 200,
    minWidth: 150
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
          <tr key={fatura.id} className="border-b hover:bg-gray-50 transition-colors">
            <td className="p-2 whitespace-nowrap">
              <span className="font-medium text-gray-900">
                {fatura.unidade_beneficiaria.cooperado.nome}
              </span>
              {fatura.unidade_beneficiaria.apelido && (
                <span className="text-gray-400 ml-1">
                  ({fatura.unidade_beneficiaria.apelido})
                </span>
              )}
            </td>
            <td className="p-2 whitespace-nowrap text-gray-600">
              {formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}
            </td>
            <td className="p-2 whitespace-nowrap text-gray-600">
              {fatura.unidade_beneficiaria.numero_uc}
            </td>
            <td className="p-2 whitespace-nowrap">{formatDateToPtBR(fatura.data_vencimento)}</td>
            <td className="p-2 text-right whitespace-nowrap">{fatura.consumo_kwh} kWh</td>
            <td className="p-2 text-right whitespace-nowrap font-mono">{formatCurrency(fatura.total_fatura)}</td>
            <td className="p-2 text-right whitespace-nowrap font-mono">{formatCurrency(fatura.fatura_concessionaria)}</td>
            <td className="p-2 text-right whitespace-nowrap font-mono">{fatura.unidade_beneficiaria.percentual_desconto}%</td>
            <td className="p-2 text-right whitespace-nowrap font-mono">{formatCurrency(fatura.valor_desconto)}</td>
            <td className="p-2 text-right whitespace-nowrap font-mono">
              {formatCurrency(fatura.valor_assinatura)}
              {fatura.valor_adicional > 0 && (
                <span className="text-yellow-600 text-xs ml-1">
                  +{formatCurrency(fatura.valor_adicional)}
                </span>
              )}
            </td>
            <td className="p-2 whitespace-nowrap">
              <FaturaStatusBadge fatura={fatura} />
            </td>
            <td className="p-2 whitespace-nowrap text-center">
              {fatura.arquivo_concessionaria_path ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onViewPdf}
                  title="Visualizar conta de energia"
                  className="h-6 w-6"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              ) : (
                <span className="text-gray-400 text-sm">-</span>
              )}
            </td>
            <td className="p-2 text-right whitespace-nowrap">
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
