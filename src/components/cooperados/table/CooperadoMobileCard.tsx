
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { CooperadoPdfButton } from "../CooperadoPdfButton";
import { formatarDocumento, formatarTelefone } from "@/utils/formatters";
import { CooperadoMobileCardProps } from "./types";

export function CooperadoMobileCard({ 
  cooperado, 
  unidades, 
  onEdit, 
  onDelete, 
  onAddUnidade, 
  onViewDetails 
}: CooperadoMobileCardProps) {
  return (
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
  );
}
