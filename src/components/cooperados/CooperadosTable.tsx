
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome/Razão Social</TableHead>
            <TableHead>CPF/CNPJ</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Unidades</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cooperados.map((cooperado) => (
            <TableRow 
              key={cooperado.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onViewDetails(cooperado.id)}
            >
              <TableCell>{cooperado.nome}</TableCell>
              <TableCell>{cooperado.documento ? formatarDocumento(cooperado.documento) : '-'}</TableCell>
              <TableCell>
                {cooperado.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
              </TableCell>
              <TableCell>
                <div>
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
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(cooperado.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(cooperado.id);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(cooperado.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
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
