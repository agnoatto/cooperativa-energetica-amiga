import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Faturas = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Faturas</h1>
        <div className="space-x-2">
          <Button variant="outline">Filtrar</Button>
          <Button className="bg-primary hover:bg-primary/90">Gerar Faturas</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cooperado</TableHead>
              <TableHead>Mês Referência</TableHead>
              <TableHead>Consumo (kWh)</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>João Silva</TableCell>
              <TableCell>Março/2024</TableCell>
              <TableCell>500 kWh</TableCell>
              <TableCell>R$ 225,00</TableCell>
              <TableCell>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                  Pendente
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Faturas;