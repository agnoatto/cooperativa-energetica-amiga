
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { FaturaPdfButton } from "./FaturaPdfButton";

interface Fatura {
  id: string;
  consumo_kwh: number;
  valor_total: number;
  status: string;
  data_vencimento: string;
  mes: number;
  ano: number;
  fatura_concessionaria: number;
  total_fatura: number;
  iluminacao_publica: number;
  outros_valores: number;
  valor_desconto: number;
  unidade_beneficiaria: {
    numero_uc: string;
    apelido: string | null;
    endereco: string;
    percentual_desconto: number;
    cooperado: {
      nome: string;
      documento: string | null;
    };
  };
}

interface FaturasTableProps {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  onEditFatura: (fatura: Fatura) => void;
}

export function FaturasTable({ faturas, isLoading, onEditFatura }: FaturasTableProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const calcularValorAssinatura = (fatura: Fatura) => {
    // Base para desconto = Valor Total - Iluminação - Outros
    const baseDesconto = fatura.total_fatura - fatura.iluminacao_publica - fatura.outros_valores;
    // Valor após desconto = Base - Valor do Desconto
    const valorAposDesconto = baseDesconto - fatura.valor_desconto;
    // Valor final da assinatura = Valor após desconto - Conta de Energia
    return valorAposDesconto - fatura.fatura_concessionaria;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cooperado</TableHead>
            <TableHead>UC</TableHead>
            <TableHead>Consumo (kWh)</TableHead>
            <TableHead>Valor Original</TableHead>
            <TableHead>Conta de Energia</TableHead>
            <TableHead>Desconto (%)</TableHead>
            <TableHead>Valor Desconto</TableHead>
            <TableHead>Valor da Assinatura</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : faturas && faturas.length > 0 ? (
            faturas.map((fatura) => (
              <TableRow key={fatura.id}>
                <TableCell>{fatura.unidade_beneficiaria.cooperado.nome}</TableCell>
                <TableCell>
                  {fatura.unidade_beneficiaria.numero_uc}
                  {fatura.unidade_beneficiaria.apelido && (
                    <span className="text-gray-500 text-sm ml-1">
                      ({fatura.unidade_beneficiaria.apelido})
                    </span>
                  )}
                </TableCell>
                <TableCell>{fatura.consumo_kwh} kWh</TableCell>
                <TableCell>{formatCurrency(fatura.total_fatura)}</TableCell>
                <TableCell>{formatCurrency(fatura.fatura_concessionaria)}</TableCell>
                <TableCell>{fatura.unidade_beneficiaria.percentual_desconto}%</TableCell>
                <TableCell>{formatCurrency(fatura.valor_desconto)}</TableCell>
                <TableCell>{formatCurrency(calcularValorAssinatura(fatura))}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    fatura.status === 'pendente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : fatura.status === 'paga'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {fatura.status.charAt(0).toUpperCase() + fatura.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEditFatura(fatura)}
                    title="Editar Fatura"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <FaturaPdfButton fatura={fatura} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-gray-500">
                Nenhuma fatura encontrada para este mês
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
