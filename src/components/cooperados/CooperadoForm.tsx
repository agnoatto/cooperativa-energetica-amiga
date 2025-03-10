
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoFields } from "./BasicInfoFields";
import { ResponsavelFields } from "./ResponsavelFields";
import { ContatoFields } from "./ContatoFields";
import { cooperadoFormSchema, type CooperadoFormValues } from "./schema";
import { useEffect, useState } from "react";

interface CooperadoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cooperadoId?: string;
  onSuccess?: () => void;
}

export function CooperadoForm({ open, onOpenChange, cooperadoId, onSuccess }: CooperadoFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CooperadoFormValues>({
    resolver: zodResolver(cooperadoFormSchema),
    defaultValues: {
      nome: "",
      documento: "",
      tipo_pessoa: "PF",
      telefone: "",
      email: "",
      responsavel_nome: "",
      responsavel_cpf: "",
      responsavel_telefone: "",
      numero_cadastro: "",
    },
  });

  const tipoPessoa = form.watch("tipo_pessoa");

  // Fetch cooperado data when editing
  useEffect(() => {
    async function fetchCooperado() {
      if (!cooperadoId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('cooperados')
          .select('*')
          .eq('id', cooperadoId)
          .single();

        if (error) throw error;

        if (data) {
          console.log('Loaded cooperado data:', data);
          form.reset({
            nome: data.nome || "",
            documento: data.documento || "",
            tipo_pessoa: data.tipo_pessoa as "PF" | "PJ" || "PF",
            telefone: data.telefone || "",
            email: data.email || "",
            responsavel_nome: data.responsavel_nome || "",
            responsavel_cpf: data.responsavel_cpf || "",
            responsavel_telefone: data.responsavel_telefone || "",
            numero_cadastro: data.numero_cadastro || "",
          });
        }
      } catch (error: any) {
        console.error('Error loading cooperado:', error);
        toast.error("Erro ao carregar dados do cooperado: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (open) {
      fetchCooperado();
    }
  }, [cooperadoId, open, form]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(data: CooperadoFormValues) {
    try {
      setIsLoading(true);
      console.log('Submitting form with data:', data);

      // Check if numero_cadastro is unique
      if (data.numero_cadastro) {
        const { data: existingCooperado, error: checkError } = await supabase
          .from('cooperados')
          .select('id')
          .eq('numero_cadastro', data.numero_cadastro)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingCooperado && existingCooperado.id !== cooperadoId) {
          toast.error("Número de cadastro já existe");
          return;
        }
      }

      const cooperadoData = {
        nome: data.nome,
        documento: data.documento.replace(/\D/g, ''),
        telefone: data.telefone.replace(/\D/g, ''),
        email: data.email,
        tipo_pessoa: data.tipo_pessoa,
        responsavel_nome: data.responsavel_nome,
        responsavel_cpf: data.responsavel_cpf?.replace(/\D/g, ''),
        responsavel_telefone: data.responsavel_telefone?.replace(/\D/g, ''),
        numero_cadastro: data.numero_cadastro,
      };

      if (cooperadoId) {
        // Update existing cooperado
        const { error } = await supabase
          .from('cooperados')
          .update(cooperadoData)
          .eq('id', cooperadoId);

        if (error) throw error;
        toast.success("Cooperado atualizado com sucesso!");
      } else {
        // Create new cooperado
        const { error } = await supabase
          .from('cooperados')
          .insert(cooperadoData);

        if (error) throw error;
        toast.success("Cooperado cadastrado com sucesso!");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving cooperado:', error);
      toast.error(`Erro ao ${cooperadoId ? 'atualizar' : 'cadastrar'} cooperado: ` + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {cooperadoId ? "Editar Cooperado" : "Novo Cooperado"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <BasicInfoFields form={form} />
            {tipoPessoa === "PJ" && <ResponsavelFields form={form} />}
            <ContatoFields form={form} />

            <div className="flex justify-end gap-2">
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
