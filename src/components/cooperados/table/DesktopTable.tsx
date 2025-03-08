
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { formatarDocumento, formatarTelefone } from "@/utils/formatters";
import { ActionMenu } from "./ActionMenu";
import { cooperadosTableColumns } from "./tableConfig";
import { CooperadoTableProps } from "./types";

export function DesktopTable({ 
  cooperados, 
  unidades, 
  onEdit, 
  onDelete, 
  onAddUnidade, 
  onViewDetails 
}: CooperadoTableProps) {
  return (
    <ExcelTable 
      columns={cooperadosTableColumns} 
      storageKey="cooperados-table-settings"
    >
      <tbody>
        {cooperados.map((cooperado) => (
          <tr
            key={cooperado.id}
            className="cursor-pointer h-9"
          >
            <td className="py-1.5">
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {cooperado.nome}
                </span>
                <span className="text-xs text-gray-500">
                  {formatarDocumento(cooperado.documento)}
                </span>
              </div>
            </td>
            <td className="py-1.5">{cooperado.numero_cadastro || '-'}</td>
            <td className="py-1.5">
              {cooperado.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
            </td>
            <td className="py-1.5">
              <div className="leading-tight text-sm">
                {formatarTelefone(cooperado.telefone)}
                <br />
                {cooperado.email || '-'}
              </div>
            </td>
            <td className="py-1.5">
              <div className="flex items-center space-x-2">
                <span>
                  {unidades.filter(u => u.cooperado_id === cooperado.id).length}
                </span>
              </div>
            </td>
            <td className="text-right py-1.5 w-10">
              <ActionMenu 
                cooperado={cooperado}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddUnidade={onAddUnidade}
                onViewDetails={onViewDetails}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </ExcelTable>
  );
}
