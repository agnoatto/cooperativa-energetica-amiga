
/**
 * Tabela de cooperados para visualização em desktop
 * 
 * Este componente exibe os cooperados em formato de tabela para desktop,
 * permitindo visualizar informações como nome, documento, contato e ações disponíveis.
 * Também mostra o status do cooperado (ativo ou inativo) e permite reativação 
 * de cooperados inativos. As linhas são clicáveis para abrir a visualização de detalhes.
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CooperadoTableProps } from "./types";
import { formatarContato, formatarDocumentoCooperado, formatarInfoUnidades } from "./utils/formatters";
import { TipoPessoaBadge } from "./components/TipoPessoaBadge";
import { CooperadoStatusBadge } from "./components/StatusBadge";
import { ReativarButton } from "./components/ReativarButton";
import { AcoesPopover } from "./components/AcoesPopover";

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
                <TableRow 
                  key={cooperado.id} 
                  className={`${isInativo ? "bg-gray-50" : ""} hover:bg-gray-100 cursor-pointer`}
                  onClick={() => onViewDetails(cooperado.id)}
                >
                  <TableCell className="font-medium">{cooperado.nome}</TableCell>
                  <TableCell>
                    {formatarDocumentoCooperado(cooperado.documento, cooperado.tipo_pessoa)}
                  </TableCell>
                  <TableCell>
                    <TipoPessoaBadge tipoPessoa={cooperado.tipo_pessoa} />
                  </TableCell>
                  <TableCell>
                    {formatarContato(cooperado.telefone, cooperado.email)}
                  </TableCell>
                  <TableCell>{cooperado.numero_cadastro || "-"}</TableCell>
                  <TableCell>
                    {formatarInfoUnidades(unidadesDoCooperado.length)}
                  </TableCell>
                  <TableCell>
                    <CooperadoStatusBadge isInativo={isInativo} />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    {isInativo ? (
                      <ReativarButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          onReactivate(cooperado.id);
                        }}
                      />
                    ) : (
                      <AcoesPopover 
                        onViewDetails={() => onViewDetails(cooperado.id)}
                        onEdit={() => onEdit(cooperado.id)}
                        onAddUnidade={() => onAddUnidade(cooperado.id)}
                        onDelete={() => onDelete(cooperado.id)}
                      />
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
