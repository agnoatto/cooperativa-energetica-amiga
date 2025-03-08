
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CalculoFaturaTemplate } from "@/types/template";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplateTableProps {
  templates: CalculoFaturaTemplate[];
  isLoading: boolean;
  onEdit: (template: CalculoFaturaTemplate) => void;
  onDelete: (template: CalculoFaturaTemplate) => void;
}

export function TemplateTable({ templates, isLoading, onEdit, onDelete }: TemplateTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md">
        <p className="text-muted-foreground">
          Nenhum template de cálculo cadastrado. Crie um novo template para começar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[150px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template.id}>
            <TableCell className="font-medium">{template.nome}</TableCell>
            <TableCell>{template.descricao || "-"}</TableCell>
            <TableCell>
              {template.is_padrao && (
                <Badge>Padrão</Badge>
              )}
            </TableCell>
            <TableCell className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(template)}
                title="Editar template"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(template)}
                title="Excluir template"
                disabled={template.is_padrao}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
