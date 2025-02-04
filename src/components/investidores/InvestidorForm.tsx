import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";

const investidorFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  documento: z.string().min(1, "Documento é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  beneficiario_nome: z.string().optional(),
  beneficiario_documento: z.string().optional(),
  beneficiario_banco: z.string().optional(),
  beneficiario_agencia: z.string().optional(),
  beneficiario_conta: z.string().optional(),
  beneficiario_telefone: z.string().optional(),
  beneficiario_email: z.string().email("Email inválido").optional().or(z.literal("")),
});

type InvestidorFormData = z.infer<typeof investidorFormSchema>;

interface InvestidorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investidorId?: string;
  onSuccess: () => void;
}

export function InvestidorForm({ open, onOpenChange, investidorId, onSuccess }: InvestidorFormProps) {
  const { toast } = useToast();
  const form = useForm<InvestidorFormData>({
    resolver: zodResolver(investidorFormSchema),
    defaultValues: {
      nome: "",
      documento: "",
      telefone: "",
      email: "",
      beneficiario_nome: "",
      beneficiario_documento: "",
      beneficiario_banco: "",
      beneficiario_agencia: "",
      beneficiario_conta: "",
      beneficiario_telefone: "",
      beneficiario_email: "",
    },
  });

  React.useEffect(() => {
    if (investidorId) {
      supabase
        .from("investidores")
        .select("*")
        .eq("id", investidorId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching investidor:", error);
            return;
          }
          if (data) {
            form.reset({
              nome: data.nome,
              documento: data.documento,
              telefone: data.telefone || "",
              email: data.email || "",
              beneficiario_nome: data.beneficiario_nome || "",
              beneficiario_documento: data.beneficiario_documento || "",
              beneficiario_banco: data.beneficiario_banco || "",
              beneficiario_agencia: data.beneficiario_agencia || "",
              beneficiario_conta: data.beneficiario_conta || "",
              beneficiario_telefone: data.beneficiario_telefone || "",
              beneficiario_email: data.beneficiario_email || "",
            });
          }
        });
    } else {
      form.reset({
        nome: "",
        documento: "",
        telefone: "",
        email: "",
        beneficiario_nome: "",
        beneficiario_documento: "",
        beneficiario_banco: "",
        beneficiario_agencia: "",
        beneficiario_conta: "",
        beneficiario_telefone: "",
        beneficiario_email: "",
      });
    }
  }, [investidorId, form]);

  const onSubmit = async (data: InvestidorFormData) => {
    try {
      const submitData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      if (investidorId) {
        const { error } = await supabase
          .from("investidores")
          .update(submitData)
          .eq("id", investidorId);
        if (error) throw error;
        toast({
          title: "Investidor atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from("investidores")
          .insert({
            ...submitData,
            created_at: new Date().toISOString(),
          });
        if (error) throw error;
        toast({
          title: "Investidor criado com sucesso!",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving investidor:", error);
      toast({
        title: "Erro ao salvar investidor",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {investidorId ? "Editar" : "Novo"} Investidor
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados do Beneficiário</h3>

              <FormField
                control={form.control}
                name="beneficiario_nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Beneficiário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="beneficiario_documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento do Beneficiário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="beneficiario_banco"
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

              <FormField
                control={form.control}
                name="beneficiario_agencia"
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

              <FormField
                control={form.control}
                name="beneficiario_conta"
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

              <FormField
                control={form.control}
                name="beneficiario_telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do Beneficiário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="beneficiario_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Beneficiário</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}