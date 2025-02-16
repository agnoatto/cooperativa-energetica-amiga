
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "../../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UnidadeUsinaFormData>({
    resolver: zodResolver(unidadeUsinaFormSchema),
    defaultValues: {
      numero_uc: "",
      apelido: "",
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
    async function loadUnidade() {
      if (!unidadeId) return;

      try {
        setIsLoading(true);
        
        // Primeiro busca a unidade
        const { data: unidade, error: unidadeError } = await supabase
          .from("unidades_usina")
          .select("*")
          .eq("id", unidadeId)
          .maybeSingle();

        if (unidadeError) throw unidadeError;
        if (!unidade) {
          toast({
            title: "Erro ao carregar unidade",
            description: "Unidade não encontrada",
            variant: "destructive",
          });
          return;
        }

        // Validar se o tipo de titular é válido
        if (unidade.titular_tipo !== "cooperativa" && unidade.titular_tipo !== "cooperado") {
          toast({
            title: "Erro ao carregar unidade",
            description: "Tipo de titular inválido",
            variant: "destructive",
          });
          return;
        }

        // Agora busca os dados do titular
        const titularQuery = unidade.titular_tipo === "cooperativa"
          ? supabase
              .from("cooperativas")
              .select("id, nome")
              .eq("id", unidade.titular_id)
              .is("deleted_at", null)
              .maybeSingle()
          : supabase
              .from("cooperados")
              .select("id, nome")
              .eq("id", unidade.titular_id)
              .is("data_exclusao", null)
              .maybeSingle();

        const { data: titular, error: titularError } = await titularQuery;

        if (titularError) throw titularError;

        // Atualiza o formulário com os dados
        form.reset({
          numero_uc: unidade.numero_uc,
          apelido: unidade.apelido || "",
          logradouro: unidade.logradouro || "",
          numero: unidade.numero || "",
          complemento: unidade.complemento || "",
          bairro: unidade.bairro || "",
          cidade: unidade.cidade || "",
          uf: unidade.uf || "",
          cep: unidade.cep || "",
          titular_id: unidade.titular_id,
          titular_tipo: unidade.titular_tipo as "cooperado" | "cooperativa",
        });

        // Se o titular não for encontrado ou estiver inativo, mostra um aviso mas mantém os dados
        if (!titular) {
          toast({
            title: "Aviso",
            description: "Titular não encontrado ou inativo",
          });
        }
      } catch (error: any) {
        console.error("Error loading unidade:", error);
        toast({
          title: "Erro ao carregar unidade",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadUnidade();
  }, [unidadeId, form, toast]);

  const onSubmit = async (data: UnidadeUsinaFormData) => {
    try {
      setIsLoading(true);

      // Check if UC number already exists
      if (!unidadeId) {
        const { data: existing } = await supabase
          .from("unidades_usina")
          .select("id")
          .eq("numero_uc", data.numero_uc)
          .maybeSingle();

        if (existing) {
          toast({
            title: "Erro ao salvar unidade",
            description: "Já existe uma unidade com este número UC",
            variant: "destructive",
          });
          return;
        }
      }

      // Prepare the data
      const submitData = {
        numero_uc: data.numero_uc,
        apelido: data.apelido,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf.toUpperCase(),
        cep: data.cep,
        titular_id: data.titular_id,
        titular_tipo: data.titular_tipo,
      };

      // Use upsert to handle both insert and update
      const { error } = await supabase
        .from("unidades_usina")
        .upsert(
          {
            id: unidadeId,
            ...submitData,
          },
          {
            onConflict: "id",
          }
        );

      if (error) throw error;

      toast({
        title: `Unidade ${unidadeId ? "atualizada" : "criada"} com sucesso!`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving unidade:", error);
      toast({
        title: "Erro ao salvar unidade",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
}
