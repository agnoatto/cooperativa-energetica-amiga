
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { CooperadoPdfButton } from "./CooperadoPdfButton";
import { formatarDocumento, formatarTelefone } from "@/utils/formatters";
import { useIsMobile } from "@/hooks/use-mobile";

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

  if (isMobile) {
    return (
      <div className="space-y-4">
        {cooperados.map((cooperado) => (
          <div
            key={cooperado.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
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
                    onClick={() => onAddUnidade(cooperado.id)}
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
                onClick={() => onViewDetails(cooperado.id)}
                className="h-10 w-10 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(cooperado.id)}
                className="h-10 w-10 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(cooperado.id)}
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

  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse [&_tr:hover]:bg-gray-50">
          <TableHeader className="[&_tr]:h-8 [&_th]:p-2 [&_th]:border-x [&_th]:border-gray-200 [&_tr]:border-b [&_tr]:border-gray-200">
            <TableRow>
              <TableHead>Nome/Razão Social</TableHead>
              <TableHead>Nº Cadastro</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Unidades</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:h-8 [&_td]:p-2 [&_td]:border-x [&_td]:border-gray-200 [&_tr]:border-b [&_tr]:border-gray-200">
            {cooperados.map((cooperado) => (
              <TableRow 
                key={cooperado.id} 
                className="cursor-pointer"
                onClick={() => onViewDetails(cooperado.id)}
              >
                <TableCell className="whitespace-nowrap">{cooperado.nome}</TableCell>
                <TableCell className="whitespace-nowrap">{cooperado.numero_cadastro || '-'}</TableCell>
                <TableCell className="whitespace-nowrap">{cooperado.documento ? formatarDocumento(cooperado.documento) : '-'}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {cooperado.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </TableCell>
                <TableCell>
                  <div className="leading-tight whitespace-nowrap">
                    {formatarTelefone(cooperado.telefone)}
                    <br />
                    {cooperado.email || '-'}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span>{unidades.filter(u => u.cooperado_id === cooperado.id).length}</span>
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
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(cooperado.id);
                    }}
                    className="h-6 w-6"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(cooperado.id);
                    }}
                    className="h-6 w-6"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(cooperado.id);
                    }}
                    className="h-6 w-6"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                  <CooperadoPdfButton
                    cooperado={cooperado}
                    unidades={unidades.filter(u => u.cooperado_id === cooperado.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
