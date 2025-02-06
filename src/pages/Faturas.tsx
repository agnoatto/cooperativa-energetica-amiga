
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, lastDayOfMonth } from "date-fns";
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

interface UnidadeBeneficiaria {
  id: string;
  numero_uc: string;
  apelido: string | null;
  cooperado: {
    nome: string;
  };
}

const Faturas = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const queryClient = useQueryClient();

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

  const gerarFaturasMutation = useMutation({
    mutationFn: async () => {
      // 1. Buscar unidades beneficiárias ativas
      const { data: unidades, error: unidadesError } = await supabase
        .from("unidades_beneficiarias")
        .select(`
          id,
          numero_uc,
          apelido,
          cooperado:cooperado_id (
            nome
          )
        `)
        .filter('data_saida', 'is', null); // Changed this line to use filter instead of is

      if (unidadesError) throw unidadesError;

      // 2. Para cada unidade, verificar se já existe fatura e criar se necessário
      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();
      const dataVencimento = lastDayOfMonth(currentDate);

      const unidadesComFatura = await Promise.all(
        (unidades as UnidadeBeneficiaria[]).map(async (unidade) => {
          // Verificar se já existe fatura para esta unidade neste mês/ano
          const { data: faturasExistentes } = await supabase
            .from("faturas")
            .select()
            .eq("unidade_beneficiaria_id", unidade.id)
            .eq("mes", mes)
            .eq("ano", ano);

          if (faturasExistentes && faturasExistentes.length > 0) {
            return null; // Pular se já existe fatura
          }

          // Criar nova fatura
          const { error: insertError } = await supabase
            .from("faturas")
            .insert({
              unidade_beneficiaria_id: unidade.id,
              mes,
              ano,
              consumo_kwh: 0,
              valor_total: 0,
              status: "pendente",
              data_vencimento: dataVencimento.toISOString().split('T')[0],
            });

          if (insertError) throw insertError;
          return unidade;
        })
      );

      return unidadesComFatura.filter(Boolean);
    },
    onSuccess: (unidades) => {
      const count = unidades?.length || 0;
      queryClient.invalidateQueries({ queryKey: ["faturas"] });
      if (count > 0) {
        toast.success(`${count} faturas geradas com sucesso!`);
      } else {
        toast.info("Todas as faturas já foram geradas para este mês.");
      }
    },
    onError: (error) => {
      console.error("Erro ao gerar faturas:", error);
      toast.error("Erro ao gerar faturas");
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
    gerarFaturasMutation.mutate();
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
            disabled={gerarFaturasMutation.isPending}
          >
            {gerarFaturasMutation.isPending ? "Gerando..." : "Gerar Faturas"}
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
