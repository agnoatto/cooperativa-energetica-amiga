
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
            className="cursor-pointer"
          >
            <td>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {cooperado.nome}
                </span>
                <span className="text-sm text-gray-500">
                  {formatarDocumento(cooperado.documento)}
                </span>
              </div>
            </td>
            <td>{cooperado.numero_cadastro || '-'}</td>
            <td>
              {cooperado.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
            </td>
            <td>
              <div className="leading-tight">
                {formatarTelefone(cooperado.telefone)}
                <br />
                {cooperado.email || '-'}
              </div>
            </td>
            <td>
              <div className="flex items-center space-x-2">
                <span>
                  {unidades.filter(u => u.cooperado_id === cooperado.id).length}
                </span>
              </div>
            </td>
            <td className="text-right">
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
