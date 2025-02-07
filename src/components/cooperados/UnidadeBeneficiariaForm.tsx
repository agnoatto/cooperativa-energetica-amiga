
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { AddressFields } from "./AddressFields";
import { UnidadeBeneficiariaBasicInfo } from "./UnidadeBeneficiariaBasicInfo";
import { UnidadeBeneficiariaDateFields } from "./UnidadeBeneficiariaDateFields";
import { UnidadeBeneficiariaFormProps, UnidadeBeneficiariaFormValues, ViaCEPResponse } from "./types";
import { unidadeBeneficiariaFormSchema } from "./schema";

export function UnidadeBeneficiariaForm({
  open,
  onOpenChange,
  cooperadoId,
  unidadeId,
  onSuccess,
}: UnidadeBeneficiariaFormProps) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
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
    },
  });

  const fetchCep = async (cep: string) => {
    try {
      setIsLoadingCep(true);
      const cleanCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCEPResponse = await response.json();

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

  async function onSubmit(data: UnidadeBeneficiariaFormValues) {
    try {
      const endereco = `${data.logradouro}, ${data.numero}${data.complemento ? `, ${data.complemento}` : ''} - ${data.bairro}, ${data.cidade} - ${data.uf}, ${data.cep}`;
      
      const unidadeData = {
        cooperado_id: cooperadoId,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {unidadeId ? "Editar Unidade Beneficiária" : "Nova Unidade Beneficiária"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UnidadeBeneficiariaBasicInfo form={form} />
            <AddressFields 
              form={form}
              isLoadingCep={isLoadingCep}
              onFetchCep={fetchCep}
            />
            <UnidadeBeneficiariaDateFields form={form} />

            <div className="flex justify-end gap-2">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
