
/**
 * Tabela de cooperados para visualização em desktop
 * 
 * Este componente exibe os cooperados em formato de tabela para desktop,
 * permitindo visualizar informações como nome, documento, contato e ações disponíveis.
 * Também mostra o status do cooperado (ativo ou inativo) e permite reativação 
 * de cooperados inativos.
 */
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BuildingIcon, User2, MoreHorizontal, RefreshCw, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { CooperadoTableProps } from "./types";
import { formatarDocumento } from "@/utils/formatters";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export function DesktopTable({
  cooperados,
  unidades,
  onEdit,
  onDelete,
  onReactivate,
  onAddUnidade,
  onViewDetails,
  statusFilter
}: CooperadoTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Nº Cadastro</TableHead>
            <TableHead>Unid. Beneficiárias</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cooperados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhum cooperado encontrado.
              </TableCell>
            </TableRow>
          ) : (
            cooperados.map((cooperado) => {
              const unidadesDoCooperado = unidades.filter(
                (u) => u.cooperado_id === cooperado.id
              );
              const isInativo = cooperado.data_exclusao !== null;

              return (
                <TableRow key={cooperado.id} className={isInativo ? "bg-gray-50" : ""}>
                  <TableCell className="font-medium">{cooperado.nome}</TableCell>
                  <TableCell>
                    {cooperado.documento
                      ? formatarDocumento(
                          cooperado.documento,
                          cooperado.tipo_pessoa
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {cooperado.tipo_pessoa === "PF" ? (
                      <Badge variant="outline" className="bg-blue-50">
                        <User2 className="mr-1 h-3 w-3" />
                        Pessoa Física
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50">
                        <BuildingIcon className="mr-1 h-3 w-3" />
                        Pessoa Jurídica
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {cooperado.telefone || cooperado.email
                      ? [
                          cooperado.telefone &&
                            `Tel: ${cooperado.telefone}`,
                          cooperado.email && `Email: ${cooperado.email}`,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell>{cooperado.numero_cadastro || "-"}</TableCell>
                  <TableCell>
                    {unidadesDoCooperado.length > 0
                      ? `${unidadesDoCooperado.length} unidade(s)`
                      : "Nenhuma unidade"}
                  </TableCell>
                  <TableCell>
                    {isInativo ? (
                      <Badge variant="outline" className="bg-red-50 text-red-600">
                        Inativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-600">
                        Ativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isInativo ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onReactivate(cooperado.id)}
                        className="text-green-600"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reativar
                      </Button>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 p-2">
                          <div className="space-y-1">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start"
                              onClick={() => onViewDetails(cooperado.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </Button>

                            <Button 
                              variant="ghost" 
                              className="w-full justify-start"
                              onClick={() => onEdit(cooperado.id)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </Button>

                            <Button 
                              variant="ghost" 
                              className="w-full justify-start"
                              onClick={() => onAddUnidade(cooperado.id)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar unidade
                            </Button>

                            <div className="border-t border-gray-200 my-1"></div>
                            
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                              onClick={() => onDelete(cooperado.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
