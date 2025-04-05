
/**
 * Componente de Gerenciamento de Contas Bancárias
 * 
 * Este componente permite cadastrar, editar e gerenciar contas bancárias e caixas
 * diretamente nas configurações do sistema, simplificando o gerenciamento financeiro
 * e centralizando o controle de contas.
 */
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  CreditCard, 
  Wallet, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash, 
  AlertCircle 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ContaBancaria, TipoContaBancaria } from "@/types/contas-bancos";
import { useContasBancarias } from "@/hooks/contas-bancos/useContasBancarias";
import { useContaBancaria } from "@/hooks/contas-bancos/useContaBancaria";
import { formatarMoeda } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Schema de validação do formulário
const contaBancariaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["corrente", "poupanca", "investimento", "caixa"]),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  digito: z.string().optional(),
  saldo_inicial: z.number().nonnegative("Saldo inicial não pode ser negativo"),
  data_saldo_inicial: z.string(),
  descricao: z.string().optional(),
  cor: z.string().optional(),
  status: z.enum(["ativa", "inativa", "bloqueada"]).default("ativa"),
});

type ContaBancariaFormValues = z.infer<typeof contaBancariaSchema>;

export function ContasBancariasForm() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingContaId, setEditingContaId] = useState<string | null>(null);
  const [selectedConta, setSelectedConta] = useState<ContaBancaria | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { data: contas, isLoading, refetch } = useContasBancarias();
  const { 
    data: contaAtual, 
    salvarContaBancaria, 
    excluirContaBancaria 
  } = useContaBancaria(editingContaId || undefined);
  
  const form = useForm<ContaBancariaFormValues>({
    resolver: zodResolver(contaBancariaSchema),
    defaultValues: {
      nome: "",
      tipo: "corrente" as TipoContaBancaria,
      banco: "",
      agencia: "",
      conta: "",
      digito: "",
      saldo_inicial: 0,
      data_saldo_inicial: new Date().toISOString().split('T')[0],
      descricao: "",
      cor: "#3b82f6",
      status: "ativa",
    },
  });
  
  // Carregar dados da conta para edição
  useState(() => {
    if (contaAtual) {
      form.reset({
        nome: contaAtual.nome,
        tipo: contaAtual.tipo,
        banco: contaAtual.banco || undefined,
        agencia: contaAtual.agencia || undefined,
        conta: contaAtual.conta || undefined,
        digito: contaAtual.digito || undefined,
        saldo_inicial: contaAtual.saldo_inicial,
        data_saldo_inicial: contaAtual.data_saldo_inicial.split('T')[0],
        descricao: contaAtual.descricao || undefined,
        cor: contaAtual.cor || "#3b82f6",
        status: contaAtual.status,
      });
    }
  });
  
  const handleEdit = (conta: ContaBancaria) => {
    setEditingContaId(conta.id);
    setShowForm(true);
  };
  
  const handleCreate = () => {
    form.reset({
      nome: "",
      tipo: "corrente" as TipoContaBancaria,
      banco: "",
      agencia: "",
      conta: "",
      digito: "",
      saldo_inicial: 0,
      data_saldo_inicial: new Date().toISOString().split('T')[0],
      descricao: "",
      cor: "#3b82f6",
      status: "ativa",
    });
    setEditingContaId(null);
    setShowForm(true);
  };
  
  const confirmDelete = (conta: ContaBancaria) => {
    setSelectedConta(conta);
    setShowDeleteDialog(true);
  };
  
  const handleDelete = async () => {
    if (!selectedConta) return;
    
    try {
      await excluirContaBancaria(selectedConta.id);
      toast({
        title: "Conta excluída",
        description: `A conta "${selectedConta.nome}" foi excluída com sucesso.`,
      });
      refetch();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast({
        title: "Erro ao excluir conta",
        description: "Não foi possível excluir a conta bancária.",
        variant: "destructive",
      });
    }
  };
  
  const onSubmit = async (values: ContaBancariaFormValues) => {
    try {
      // Preparar dados para salvar
      const dadosConta = {
        ...values,
        // Converter string para número
        saldo_inicial: Number(values.saldo_inicial),
      };
      
      await salvarContaBancaria(dadosConta);
      
      toast({
        title: editingContaId ? "Conta atualizada" : "Conta cadastrada",
        description: `A conta "${values.nome}" foi ${editingContaId ? "atualizada" : "cadastrada"} com sucesso.`,
      });
      
      refetch();
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar conta:", error);
      toast({
        title: "Erro ao salvar conta",
        description: "Não foi possível salvar os dados da conta bancária.",
        variant: "destructive",
      });
    }
  };
  
  const tipoConta = form.watch("tipo");
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Contas Bancárias e Caixas</CardTitle>
            <CardDescription>
              Gerencie as contas bancárias e caixas para controle financeiro
            </CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <p>Carregando contas...</p>
            </div>
          ) : contas?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhuma conta bancária cadastrada.</p>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Primeira Conta
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Saldo Atual</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contas?.map((conta) => (
                    <TableRow key={conta.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: conta.cor || '#3b82f6' }}
                          />
                          <span className="font-medium">{conta.nome}</span>
                        </div>
                        {conta.tipo !== 'caixa' && (
                          <div className="text-xs text-gray-500 mt-1">
                            {conta.banco} - Ag: {conta.agencia} Conta: {conta.conta}-{conta.digito}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {conta.tipo === 'corrente' && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <CreditCard className="h-3 w-3 mr-1" /> Corrente
                          </Badge>
                        )}
                        {conta.tipo === 'poupanca' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Wallet className="h-3 w-3 mr-1" /> Poupança
                          </Badge>
                        )}
                        {conta.tipo === 'investimento' && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <BarChart3 className="h-3 w-3 mr-1" /> Investimento
                          </Badge>
                        )}
                        {conta.tipo === 'caixa' && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            <Wallet className="h-3 w-3 mr-1" /> Caixa
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          conta.status === 'ativa' && "bg-green-100 text-green-800 hover:bg-green-100",
                          conta.status === 'inativa' && "bg-gray-100 text-gray-800 hover:bg-gray-100",
                          conta.status === 'bloqueada' && "bg-red-100 text-red-800 hover:bg-red-100",
                        )}>
                          {conta.status === 'ativa' && 'Ativa'}
                          {conta.status === 'inativa' && 'Inativa'}
                          {conta.status === 'bloqueada' && 'Bloqueada'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatarMoeda(conta.saldo_atual)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(conta)} title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => confirmDelete(conta)}
                            title="Excluir"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingContaId ? "Editar Conta" : "Nova Conta"}</DialogTitle>
            <DialogDescription>
              {editingContaId ? "Edite as informações da conta bancária ou caixa." : "Preencha os dados para cadastrar uma nova conta bancária ou caixa."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Conta</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="corrente">Conta Corrente</SelectItem>
                          <SelectItem value="poupanca">Conta Poupança</SelectItem>
                          <SelectItem value="investimento">Investimento</SelectItem>
                          <SelectItem value="caixa">Caixa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {tipoConta !== 'caixa' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="banco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banco</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="agencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agência</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-3 gap-1">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="conta"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Conta</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="digito"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dígito</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={1} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="saldo_inicial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saldo Inicial</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          value={field.value} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="data_saldo_inicial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Saldo Inicial</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor (opcional)</FormLabel>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border" 
                          style={{ backgroundColor: field.value || '#3b82f6' }}
                        />
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ativa">Ativa</SelectItem>
                          <SelectItem value="inativa">Inativa</SelectItem>
                          <SelectItem value="bloqueada">Bloqueada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit">
                  {editingContaId ? "Salvar Alterações" : "Cadastrar Conta"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de Confirmação para Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta 
              "{selectedConta?.nome}" e todas as informações associadas a ela.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
