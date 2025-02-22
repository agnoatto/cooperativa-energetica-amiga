import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Eye, MoreVertical } from "lucide-react";
import { CooperadoPdfButton } from "./CooperadoPdfButton";
import { formatarDocumento, formatarTelefone } from "@/utils/formatters";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CooperadosTableProps {
  cooperados: any[];
  unidades: any[];
  onEdit: (cooperadoId: string) => void;
  onDelete: (cooperadoId: string) => void;
  onAddUnidade: (cooperadoId: string) => void;
  onViewDetails: (cooperadoId: string) => void;
}

export function CooperadosTable({
  cooperados,
  unidades,
  onEdit,
  onDelete,
  onAddUnidade,
  onViewDetails,
}: CooperadosTableProps) {
  const isMobile = useIsMobile();

  const columns = [
    { id: 'info', label: 'Informações', minWidth: 200 },
    { id: 'cadastro', label: 'Nº Cadastro', width: 120 },
    { id: 'tipo', label: 'Tipo', width: 120 },
    { id: 'contato', label: 'Contato', minWidth: 150 },
    { id: 'unidades', label: 'Unidades', width: 100 },
    { id: 'acoes', label: 'Ações', width: 100 }
  ];

  if (isMobile) {
    return (
      <div className="space-y-4">
        {cooperados.map((cooperado) => (
          <div
            key={cooperado.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            onClick={() => onViewDetails(cooperado.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{cooperado.nome}</h3>
                <p className="text-sm text-gray-500">
                  {formatarDocumento(cooperado.documento)}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CooperadoPdfButton
                  cooperado={cooperado}
                  unidades={unidades.filter(u => u.cooperado_id === cooperado.id)}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">Nº Cadastro:</span>
                <span>{cooperado.numero_cadastro || '-'}</span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">Tipo:</span>
                <span>
                  {cooperado.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">Contato:</span>
                <div>
                  <div>{formatarTelefone(cooperado.telefone)}</div>
                  <div className="text-xs text-gray-500">{cooperado.email || '-'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">Unidades:</span>
                <div className="flex items-center gap-2">
                  <span>
                    {unidades.filter(u => u.cooperado_id === cooperado.id).length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddUnidade(cooperado.id);
                    }}
                    title="Adicionar Unidade Beneficiária"
                    className="h-6 w-6"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(cooperado.id);
                }}
                className="h-10 w-10 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(cooperado.id);
                }}
                className="h-10 w-10 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cooperado.id);
                }}
                className="h-10 w-10 p-0"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const ActionMenu = ({ cooperado }: { cooperado: any }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(cooperado.id)}>
          <Eye className="mr-2 h-4 w-4" />
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(cooperado.id)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddUnidade(cooperado.id)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Unidade
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(cooperado.id)}>
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <ExcelTable 
      columns={columns} 
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
              <ActionMenu cooperado={cooperado} />
            </td>
          </tr>
        ))}
      </tbody>
    </ExcelTable>
  );
}
