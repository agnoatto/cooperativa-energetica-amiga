
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { AddressFields } from "./AddressFields";
import { UnidadeBeneficiariaBasicInfo } from "./UnidadeBeneficiariaBasicInfo";
import { UnidadeBeneficiariaDateFields } from "./UnidadeBeneficiariaDateFields";
import { GeracaoCreditosFields } from "./GeracaoCreditosFields";
import { UnidadeBeneficiariaFormProps, UnidadeBeneficiariaFormValues } from "./types";
import { unidadeBeneficiariaFormSchema } from "./schema";

export function UnidadeBeneficiariaForm({
  open,
  onOpenChange,
  cooperadoId,
  unidadeId,
  onSuccess,
}: UnidadeBeneficiariaFormProps) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cooperados, setCooperados] = useState<any[]>([]);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<string | null>(cooperadoId);
  
  const form = useForm<UnidadeBeneficiariaFormValues>({
    resolver: zodResolver(unidadeBeneficiariaFormSchema),
    defaultValues: {
      numero_uc: "",
      apelido: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: undefined,
      percentual_desconto: "",
      data_entrada: new Date().toISOString().split('T')[0],
      data_saida: "",
      possui_geracao_propria: false,
      potencia_instalada: null,
      data_inicio_geracao: null,
      observacao_geracao: null,
      recebe_creditos_proprios: false,
      uc_origem_creditos: null,
      data_inicio_creditos: null,
      observacao_creditos: null,
    },
  });

  // Reset do formulário quando o modal é fechado
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedCooperadoId(null);
    }
  }, [open, form]);

  useEffect(() => {
    const fetchCooperados = async () => {
      try {
        const { data, error } = await supabase
          .from('cooperados')
          .select('id, nome')
          .is('data_exclusao', null)
          .order('nome');

        if (error) throw error;
        setCooperados(data || []);
      } catch (error: any) {
        toast.error("Erro ao carregar cooperados: " + error.message);
      }
    };

    fetchCooperados();
  }, []);

  useEffect(() => {
    async function fetchUnidade() {
      if (!unidadeId) return;

      try {
        const { data, error } = await supabase
          .from('unidades_beneficiarias')
          .select('*')
          .eq('id', unidadeId)
          .single();

        if (error) throw error;

        if (data) {
          setSelectedCooperadoId(data.cooperado_id);
          form.reset({
            numero_uc: data.numero_uc,
            apelido: data.apelido || "",
            cep: data.cep || "",
            logradouro: data.logradouro || "",
            numero: data.numero || "",
            complemento: data.complemento || "",
            bairro: data.bairro || "",
            cidade: data.cidade || "",
            uf: (data.uf as any) || undefined,
            percentual_desconto: data.percentual_desconto.toString(),
            data_entrada: new Date(data.data_entrada).toISOString().split('T')[0],
            data_saida: data.data_saida ? new Date(data.data_saida).toISOString().split('T')[0] : "",
            possui_geracao_propria: data.possui_geracao_propria || false,
            potencia_instalada: data.potencia_instalada,
            data_inicio_geracao: data.data_inicio_geracao ? new Date(data.data_inicio_geracao).toISOString().split('T')[0] : null,
            observacao_geracao: data.observacao_geracao,
            recebe_creditos_proprios: data.recebe_creditos_proprios || false,
            uc_origem_creditos: data.uc_origem_creditos,
            data_inicio_creditos: data.data_inicio_creditos ? new Date(data.data_inicio_creditos).toISOString().split('T')[0] : null,
            observacao_creditos: data.observacao_creditos,
          });
        }
      } catch (error: any) {
        toast.error("Erro ao carregar dados da unidade: " + error.message);
      }
    }

    if (open) {
      fetchUnidade();
    }
  }, [unidadeId, open, form]);

  const fetchCep = async (cep: string) => {
    try {
      setIsLoadingCep(true);
      const cleanCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: any = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      form.setValue('logradouro', data.logradouro);
      form.setValue('bairro', data.bairro);
      form.setValue('cidade', data.localidade);
      form.setValue('uf', data.uf as any);
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoadingCep(false);
    }
  };

  async function onSubmit(data: UnidadeBeneficiariaFormValues) {
    if (!selectedCooperadoId && !cooperadoId) {
      toast.error("Selecione um cooperado");
      return;
    }

    try {
      const endereco = `${data.logradouro}, ${data.numero}${data.complemento ? `, ${data.complemento}` : ''} - ${data.bairro}, ${data.cidade} - ${data.uf}, ${data.cep}`;
      
      const unidadeData = {
        cooperado_id: selectedCooperadoId || cooperadoId,
        numero_uc: data.numero_uc,
        apelido: data.apelido || null,
        endereco: endereco,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || null,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        cep: data.cep,
        percentual_desconto: parseFloat(data.percentual_desconto),
        data_entrada: new Date(data.data_entrada).toISOString(),
        data_saida: data.data_saida ? new Date(data.data_saida).toISOString() : null,
        possui_geracao_propria: data.possui_geracao_propria,
        potencia_instalada: data.potencia_instalada,
        data_inicio_geracao: data.data_inicio_geracao ? new Date(data.data_inicio_geracao).toISOString() : null,
        observacao_geracao: data.observacao_geracao,
        recebe_creditos_proprios: data.recebe_creditos_proprios,
        uc_origem_creditos: data.uc_origem_creditos,
        data_inicio_creditos: data.data_inicio_creditos ? new Date(data.data_inicio_creditos).toISOString() : null,
        observacao_creditos: data.observacao_creditos,
      };

      if (unidadeId) {
        const { error } = await supabase
          .from('unidades_beneficiarias')
          .update(unidadeData)
          .eq('id', unidadeId);

        if (error) throw error;
        toast.success("Unidade beneficiária atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from('unidades_beneficiarias')
          .insert(unidadeData);

        if (error) throw error;
        toast.success("Unidade beneficiária cadastrada com sucesso!");
      }

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(`Erro ao ${unidadeId ? 'atualizar' : 'cadastrar'} unidade beneficiária: ` + error.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>
            {unidadeId ? "Editar Unidade Beneficiária" : "Nova Unidade Beneficiária"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da unidade beneficiária. Todos os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!unidadeId && (
                <FormItem className="mb-4">
                  <FormLabel>Cooperado</FormLabel>
                  <Select
                    value={selectedCooperadoId || undefined}
                    onValueChange={(value) => setSelectedCooperadoId(value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cooperado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cooperados.map((cooperado) => (
                        <SelectItem key={cooperado.id} value={cooperado.id}>
                          {cooperado.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}

              <div className="space-y-6">
                <UnidadeBeneficiariaBasicInfo form={form} />
                <AddressFields 
                  form={form}
                  isLoadingCep={isLoadingCep}
                  onFetchCep={fetchCep}
                />
                <UnidadeBeneficiariaDateFields form={form} />
                <GeracaoCreditosFields form={form} />
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <Button 
                type="submit" 
                className="w-full"
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
