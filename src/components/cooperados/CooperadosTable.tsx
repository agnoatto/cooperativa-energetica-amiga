
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
  return (
    <div className="rounded-md border border-gray-200">
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
              <TableCell>{cooperado.nome}</TableCell>
              <TableCell>{cooperado.numero_cadastro || '-'}</TableCell>
              <TableCell>{cooperado.documento ? formatarDocumento(cooperado.documento) : '-'}</TableCell>
              <TableCell>
                {cooperado.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
              </TableCell>
              <TableCell>
                <div className="leading-tight">
                  {formatarTelefone(cooperado.telefone)}
                  <br />
                  {cooperado.email || '-'}
                </div>
              </TableCell>
              <TableCell>
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
              <TableCell className="text-right space-x-1">
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
  );
}
