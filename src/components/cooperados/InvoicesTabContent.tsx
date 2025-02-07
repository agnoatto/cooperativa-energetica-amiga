
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Invoice {
  id: string;
  data_vencimento: string;
  consumo_kwh: number;
  valor_total: number;
  valor_desconto: number;
  status: string;
}

interface Unit {
  id: string;
  numero_uc: string;
  apelido: string | null;
  faturas: Invoice[] | null;
}

interface InvoicesTabContentProps {
  units: Unit[] | null;
  isLoading: boolean;
}

export function InvoicesTabContent({ units, isLoading }: InvoicesTabContentProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!units || !units.some(u => u.faturas?.length > 0)) {
    return (
      <p className="text-muted-foreground text-center py-4">
        Nenhuma fatura encontrada
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {units.map((unit) => (
        unit.faturas && unit.faturas.length > 0 && (
          <div key={unit.id}>
            <h4 className="font-medium mb-2">
              UC: {unit.numero_uc}
              {unit.apelido && ` - ${unit.apelido}`}
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data Vencimento</TableHead>
                  <TableHead>Consumo (kWh)</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unit.faturas.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {format(new Date(invoice.data_vencimento), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{invoice.consumo_kwh} kWh</TableCell>
                    <TableCell>{formatCurrency(invoice.valor_total)}</TableCell>
                    <TableCell>{formatCurrency(invoice.valor_desconto)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        invoice.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : invoice.status === 'paga'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ))}
    </div>
  );
}
