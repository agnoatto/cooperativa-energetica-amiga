
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
import { 
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from "react";
import { TablePagination } from "@/components/ui/table-pagination";
import { TableColumnHeader } from "@/components/ui/table-column-header";

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = [
    {
      accessorKey: "nome",
      header: ({ column }: any) => (
        <TableColumnHeader column={column} title="Nome/Razão Social" />
      ),
    },
    {
      accessorKey: "numero_cadastro",
      header: ({ column }: any) => (
        <TableColumnHeader column={column} title="Nº Cadastro" />
      ),
    },
    {
      accessorKey: "documento",
      header: "CPF/CNPJ",
      cell: ({ row }: any) => formatarDocumento(row.getValue("documento")),
    },
    {
      accessorKey: "tipo_pessoa",
      header: ({ column }: any) => (
        <TableColumnHeader column={column} title="Tipo" />
      ),
      cell: ({ row }: any) => 
        row.getValue("tipo_pessoa") === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física',
    },
    {
      id: "contato",
      header: "Contato",
      cell: ({ row }: any) => (
        <div className="leading-tight whitespace-nowrap">
          {formatarTelefone(row.original.telefone)}
          <br />
          {row.original.email || '-'}
        </div>
      ),
    },
    {
      id: "unidades",
      header: "Unidades",
      cell: ({ row }: any) => {
        const count = unidades.filter(u => u.cooperado_id === row.original.id).length;
        return (
          <div className="flex items-center space-x-2">
            <span>{count}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onAddUnidade(row.original.id);
              }}
              title="Adicionar Unidade Beneficiária"
              className="h-6 w-6"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: any) => (
        <div className="text-right space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(row.original.id);
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
              onEdit(row.original.id);
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
              onDelete(row.original.id);
            }}
            className="h-6 w-6"
          >
            <Trash className="h-3 w-3" />
          </Button>
          <CooperadoPdfButton
            cooperado={row.original}
            unidades={unidades.filter(u => u.cooperado_id === row.original.id)}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: cooperados,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

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

  return (
    <div className="rounded-md border">
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => onViewDetails(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum cooperado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
