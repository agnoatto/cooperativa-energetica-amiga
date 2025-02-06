
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Fatura {
  id: string;
  consumo_kwh: number;
  valor_total: number;
  status: string;
  unidade_beneficiaria: {
    numero_uc: string;
    apelido: string | null;
    cooperado: {
      nome: string;
    };
  };
}

const Faturas = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: faturas, isLoading } = useQuery({
    queryKey: ["faturas", currentDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faturas")
        .select(`
          id,
          consumo_kwh,
          valor_total,
          status,
          unidade_beneficiaria:unidade_beneficiaria_id (
            numero_uc,
            apelido,
            cooperado:cooperado_id (
              nome
            )
          )
        `)
        .eq("mes", currentDate.getMonth() + 1)
        .eq("ano", currentDate.getFullYear());

      if (error) {
        toast.error("Erro ao carregar faturas");
        throw error;
      }

      return data as Fatura[];
    },
  });

  const handlePreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleGerarFaturas = async () => {
    // Aqui vamos implementar a lógica para gerar as faturas do mês
    toast.info("Em desenvolvimento: Geração de faturas");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Faturas</h1>
        <div className="space-x-2">
          <Button variant="outline">Filtrar</Button>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleGerarFaturas}
          >
            Gerar Faturas
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4 py-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-lg font-medium min-w-40 text-center">
          {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cooperado</TableHead>
              <TableHead>UC</TableHead>
              <TableHead>Consumo (kWh)</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
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
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(fatura.valor_total)}
                  </TableCell>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Nenhuma fatura encontrada para este mês
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Faturas;
