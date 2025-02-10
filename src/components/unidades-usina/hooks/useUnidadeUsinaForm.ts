
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "../../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { unidadeUsinaFormSchema, type UnidadeUsinaFormData } from "../schema";

interface UseUnidadeUsinaFormProps {
  unidadeId?: string;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useUnidadeUsinaForm({
  unidadeId,
  onSuccess,
  onOpenChange,
}: UseUnidadeUsinaFormProps) {
  const { toast } = useToast();
  const form = useForm<UnidadeUsinaFormData>({
    resolver: zodResolver(unidadeUsinaFormSchema),
    defaultValues: {
      numero_uc: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
      titular_id: "",
      titular_tipo: "cooperativa",
    },
  });

  // Clear titular_id when titular_tipo changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "titular_tipo") {
        form.setValue("titular_id", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Load data when editing
  useEffect(() => {
    if (unidadeId) {
      supabase
        .from("unidades_usina")
        .select("*")
        .eq("id", unidadeId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching unidade:", error);
            return;
          }
          if (data) {
            form.reset({
              numero_uc: data.numero_uc,
              logradouro: data.logradouro || "",
              numero: data.numero || "",
              complemento: data.complemento || "",
              bairro: data.bairro || "",
              cidade: data.cidade || "",
              uf: data.uf || "",
              cep: data.cep || "",
              titular_id: data.titular_id,
              titular_tipo: data.titular_tipo as "cooperado" | "cooperativa",
            });
          }
        });
    } else {
      form.reset({
        numero_uc: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
        titular_id: "",
        titular_tipo: "cooperativa",
      });
    }
  }, [unidadeId, form]);

  const onSubmit = async (data: UnidadeUsinaFormData) => {
    try {
      const submitData = {
        numero_uc: data.numero_uc,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf.toUpperCase(),
        cep: data.cep,
        titular_id: data.titular_id,
        titular_tipo: data.titular_tipo,
        status: 'draft' as const,
        session_id: crypto.randomUUID(),
      };

      let response;
      
      if (unidadeId) {
        response = await supabase
          .from("unidades_usina")
          .update(submitData)
          .eq("id", unidadeId);

        if (response.error) throw response.error;

        const { error: historicoError } = await supabase
          .from("historico_titulares_usina")
          .insert({
            unidade_usina_id: unidadeId,
            titular_id: data.titular_id,
            titular_tipo: data.titular_tipo,
          });

        if (historicoError) throw historicoError;

        toast({
          title: "Unidade atualizada com sucesso!",
        });
      } else {
        response = await supabase
          .from("unidades_usina")
          .insert(submitData)
          .select()
          .single();

        if (response.error) throw response.error;

        const { error: historicoError } = await supabase
          .from("historico_titulares_usina")
          .insert({
            unidade_usina_id: response.data.id,
            titular_id: data.titular_id,
            titular_tipo: data.titular_tipo,
          });

        if (historicoError) throw historicoError;

        toast({
          title: "Unidade criada com sucesso!",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving unidade:", error);
      toast({
        title: "Erro ao salvar unidade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { form, onSubmit };
}
