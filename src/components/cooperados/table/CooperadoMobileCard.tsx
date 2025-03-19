
/**
 * Card de cooperado para visualização em dispositivos móveis
 * 
 * Este componente exibe os dados de um cooperado em formato de card,
 * adaptado para visualização em dispositivos móveis. Inclui informações
 * básicas e ações disponíveis como editar, excluir, reativar e adicionar unidades.
 */
import { formatarDocumento } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BuildingIcon, Eye, User2, RefreshCw } from "lucide-react";

interface CooperadoMobileCardProps {
  cooperado: any;
  unidades: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
  onAddUnidade: (id: string) => void;
  onViewDetails: (id: string) => void;
  statusFilter: "ativos" | "inativos" | "todos";
}

export function CooperadoMobileCard({
  cooperado,
  unidades,
  onEdit,
  onDelete,
  onReactivate,
  onAddUnidade,
  onViewDetails,
}: CooperadoMobileCardProps) {
  const unidadesDoCooperado = unidades.filter(
    (u) => u.cooperado_id === cooperado.id
  );
  const isInativo = cooperado.data_exclusao !== null;

  return (
    <Card className={isInativo ? "bg-gray-50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{cooperado.nome}</CardTitle>
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
        </div>
        <CardDescription>
          {cooperado.documento
            ? `Documento: ${formatarDocumento(
                cooperado.documento,
                cooperado.tipo_pessoa
              )}`
            : "Documento não informado"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Contato:</span>
            <span className="text-sm text-gray-700">
              {cooperado.telefone || cooperado.email
                ? [
                    cooperado.telefone && `Tel: ${cooperado.telefone}`,
                    cooperado.email && `Email: ${cooperado.email}`,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">
              Nº Cadastro:
            </span>
            <span className="text-sm text-gray-700">
              {cooperado.numero_cadastro || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">
              Unidades:
            </span>
            <span className="text-sm text-gray-700">
              {unidadesDoCooperado.length > 0
                ? `${unidadesDoCooperado.length} unidade(s)`
                : "Nenhuma unidade"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">
              Status:
            </span>
            <span>
              {isInativo ? (
                <Badge variant="outline" className="bg-red-50 text-red-600">
                  Inativo
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-600">
                  Ativo
                </Badge>
              )}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(cooperado.id)}
          >
            <Eye className="mr-2 h-4 w-4" /> Detalhes
          </Button>
          
          {isInativo ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-green-600"
              onClick={() => onReactivate(cooperado.id)}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Reativar
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(cooperado.id)}
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onAddUnidade(cooperado.id)}
              >
                + Unidade
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600"
                onClick={() => onDelete(cooperado.id)}
              >
                Excluir
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
