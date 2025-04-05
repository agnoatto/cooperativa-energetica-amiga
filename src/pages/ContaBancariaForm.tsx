
/**
 * Formulário de Conta Bancária
 * 
 * Formulário para cadastro e edição de contas bancárias e caixas,
 * permitindo configurar informações como banco, agência, número da conta,
 * tipo de conta, saldo inicial e configurações visuais.
 */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CreditCard, ArrowLeft, Trash2, Landmark, Save } from "lucide-react";
import { useContaBancaria } from "@/hooks/contas-bancos/useContaBancaria";
import { TipoContaBancaria, StatusContaBancaria } from "@/types/contas-bancos";

// Esquema de validação do formulário
const contaBancariaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  tipo: z.enum(["corrente", "poupanca", "investimento", "caixa"]),
  status: z.enum(["ativa", "inativa", "bloqueada"]),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  digito: z.string().optional(),
  saldo_inicial: z.number().min(0, "Saldo inicial não pode ser negativo"),
  data_saldo_inicial: z.date(),
  descricao: z.string().optional(),
  cor: z.string().optional(),
});

type ContaBancariaFormValues = z.infer<typeof contaBancariaSchema>;

export default function ContaBancariaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Hooks para buscar e manipular conta bancária (a ser implementado depois)
  const { data: contaExistente, isLoading, salvarContaBancaria, excluirContaBancaria } = useContaBancaria(id);
  
  // Valores padrão para o formulário
  const defaultValues: Partial<ContaBancariaFormValues> = {
    nome: "",
    tipo: "corrente",
    status: "ativa",
    banco: "",
    agencia: "",
    conta: "",
    digito: "",
    saldo_inicial: 0,
    data_saldo_inicial: new Date(),
    descricao: "",
    cor: "#3b82f6", // Azul padrão
  };
  
  const form = useForm<ContaBancariaFormValues>({
    resolver: zodResolver(contaBancariaSchema),
    defaultValues,
  });
  
  // Efeito para preencher o formulário quando os dados da conta forem carregados
  useEffect(() => {
    if (contaExistente) {
      form.reset({
        nome: contaExistente.nome,
        tipo: contaExistente.tipo,
        status: contaExistente.status,
        banco: contaExistente.banco || "",
        agencia: contaExistente.agencia || "",
        conta: contaExistente.conta || "",
        digito: contaExistente.digito || "",
        saldo_inicial: contaExistente.saldo_inicial,
        data_saldo_inicial: new Date(contaExistente.data_saldo_inicial),
        descricao: contaExistente.descricao || "",
        cor: contaExistente.cor || "#3b82f6",
      });
    }
  }, [contaExistente, form]);
  
  const onSubmit = async (data: ContaBancariaFormValues) => {
    setIsSubmitting(true);
    try {
      await salvarContaBancaria(data);
      toast.success(id ? "Conta bancária atualizada com sucesso!" : "Conta bancária cadastrada com sucesso!");
      navigate('/financeiro/contas-bancos/contas');
    } catch (error) {
      console.error("Erro ao salvar conta bancária:", error);
      toast.error("Erro ao salvar conta bancária.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleExcluir = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await excluirContaBancaria(id);
      toast.success("Conta bancária excluída com sucesso!");
      navigate('/financeiro/contas-bancos/contas');
    } catch (error) {
      console.error("Erro ao excluir conta bancária:", error);
      toast.error("Erro ao excluir conta bancária.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  const tipoContaSelecionada = form.watch("tipo");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/financeiro/contas-bancos/contas')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {id ? (
              <>
                <CreditCard className="h-6 w-6 text-blue-600" />
                Editar Conta Bancária
              </>
            ) : (
              <>
                <Landmark className="h-6 w-6 text-blue-600" />
                Nova Conta Bancária
              </>
            )}
          </h1>
        </div>
        
        {id && (
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={isSubmitting}>
            <Trash2 className="h-4 w-4 mr-2" /> Excluir
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>
            Preencha as informações da conta bancária ou caixa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Conta *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Conta Principal" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome para identificação da conta
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Conta *</FormLabel>
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
              
              {tipoContaSelecionada !== 'caixa' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="banco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banco</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Banco do Brasil" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="agencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agência</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="conta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Conta</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 12345" {...field} />
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
                            <Input placeholder="Ex: 0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="saldo_inicial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saldo Inicial *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0,00" 
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Saldo inicial da conta
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="data_saldo_inicial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Saldo Inicial *</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Selecione uma data"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="cor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="color" {...field} className="w-16 h-10" />
                        </FormControl>
                        <Input 
                          value={field.value} 
                          onChange={field.onChange}
                          placeholder="#3b82f6"
                        />
                      </div>
                      <FormDescription>
                        Cor para identificação visual da conta
                      </FormDescription>
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
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição ou observações sobre esta conta..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate('/financeiro/contas-bancos/contas')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Modal de confirmação de exclusão (a ser implementado) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[400px] max-w-[90vw]">
            <CardHeader>
              <CardTitle>Confirmar exclusão</CardTitle>
              <CardDescription>
                Esta ação não pode ser desfeita. Deseja realmente excluir esta conta bancária?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleExcluir}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Excluindo..." : "Confirmar Exclusão"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
