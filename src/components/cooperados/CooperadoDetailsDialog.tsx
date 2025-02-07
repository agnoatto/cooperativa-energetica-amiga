
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface CooperadoDetailsDialogProps {
  cooperadoId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Fatura {
  id: string;
  consumo_kwh: number;
  valor_total: number;
  data_vencimento: string;
  status: string;
  valor_desconto: number;
}

export function CooperadoDetailsDialog({ cooperadoId, isOpen, onClose }: CooperadoDetailsDialogProps) {
  const { data: cooperado, isLoading: isLoadingCooperado } = useQuery({
    queryKey: ["cooperado", cooperadoId],
    queryFn: async () => {
      if (!cooperadoId) return null;
      const { data, error } = await supabase
        .from("cooperados")
        .select("*")
        .eq("id", cooperadoId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!cooperadoId,
  });

  const { data: unidades, isLoading: isLoadingUnidades } = useQuery({
    queryKey: ["unidades", cooperadoId],
    queryFn: async () => {
      if (!cooperadoId) return null;
      const { data, error } = await supabase
        .from("unidades_beneficiarias")
        .select(`
          id,
          numero_uc,
          apelido,
          endereco,
          percentual_desconto,
          data_entrada,
          data_saida,
          faturas (
            id,
            consumo_kwh,
            valor_total,
            data_vencimento,
            status,
            valor_desconto
          )
        `)
        .eq("cooperado_id", cooperadoId);

      if (error) throw error;
      return data;
    },
    enabled: !!cooperadoId,
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatarDocumento = (doc: string) => {
    if (!doc) return '-';
    const numero = doc.replace(/\D/g, '');
    if (numero.length === 11) {
      return numero.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    }
    return numero.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
  };

  const formatarTelefone = (telefone: string) => {
    if (!telefone) return '-';
    const numero = telefone.replace(/\D/g, '');
    if (numero.length === 11) {
      return numero.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
    }
    return numero.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2-$3');
  };

  if (!cooperadoId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Cooperado</DialogTitle>
        </DialogHeader>

        {isLoadingCooperado ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ) : cooperado && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Informações Pessoais</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p>{cooperado.nome}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CPF/CNPJ:</span>
                    <p>{formatarDocumento(cooperado.documento)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <p>{cooperado.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contato</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <p>{formatarTelefone(cooperado.telefone)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p>{cooperado.email || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {cooperado.tipo_pessoa === 'PJ' && (
              <div>
                <h3 className="font-semibold mb-2">Dados do Responsável</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p>{cooperado.responsavel_nome || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CPF:</span>
                    <p>{formatarDocumento(cooperado.responsavel_cpf) || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <p>{formatarTelefone(cooperado.responsavel_telefone) || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            <Tabs defaultValue="unidades" className="w-full">
              <TabsList>
                <TabsTrigger value="unidades">Unidades Beneficiárias</TabsTrigger>
                <TabsTrigger value="faturas">Histórico de Faturas</TabsTrigger>
              </TabsList>

              <TabsContent value="unidades" className="mt-4">
                {isLoadingUnidades ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : unidades && unidades.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número UC</TableHead>
                        <TableHead>Apelido</TableHead>
                        <TableHead>Endereço</TableHead>
                        <TableHead>Desconto</TableHead>
                        <TableHead>Data Entrada</TableHead>
                        <TableHead>Data Saída</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unidades.map((unidade) => (
                        <TableRow key={unidade.id}>
                          <TableCell>{unidade.numero_uc}</TableCell>
                          <TableCell>{unidade.apelido || '-'}</TableCell>
                          <TableCell>{unidade.endereco}</TableCell>
                          <TableCell>{unidade.percentual_desconto}%</TableCell>
                          <TableCell>
                            {format(new Date(unidade.data_entrada), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>
                            {unidade.data_saida
                              ? format(new Date(unidade.data_saida), 'dd/MM/yyyy')
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma unidade beneficiária encontrada
                  </p>
                )}
              </TabsContent>

              <TabsContent value="faturas" className="mt-4">
                {isLoadingUnidades ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : unidades && unidades.some(u => u.faturas?.length > 0) ? (
                  <div className="space-y-6">
                    {unidades.map((unidade) => (
                      unidade.faturas && unidade.faturas.length > 0 && (
                        <div key={unidade.id}>
                          <h4 className="font-medium mb-2">
                            UC: {unidade.numero_uc}
                            {unidade.apelido && ` - ${unidade.apelido}`}
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
                              {unidade.faturas.map((fatura: Fatura) => (
                                <TableRow key={fatura.id}>
                                  <TableCell>
                                    {format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')}
                                  </TableCell>
                                  <TableCell>{fatura.consumo_kwh} kWh</TableCell>
                                  <TableCell>{formatCurrency(fatura.valor_total)}</TableCell>
                                  <TableCell>{formatCurrency(fatura.valor_desconto)}</TableCell>
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
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma fatura encontrada
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
