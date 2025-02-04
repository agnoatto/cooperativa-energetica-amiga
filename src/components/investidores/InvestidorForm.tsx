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
import InputMask from "react-input-mask";

const investidorFormSchema = z.object({
  nome_investidor: z.string().min(1, "Nome do investidor é obrigatório"),
  documento: z.string().min(14, "CPF/CNPJ é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
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
      nome_investidor: "",
      documento: "",
      telefone: "",
      email: "",
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
              nome_investidor: data.nome_investidor,
              documento: data.documento,
              telefone: data.telefone || "",
              email: data.email || "",
            });
          }
        });
    } else {
      form.reset({
        nome_investidor: "",
        documento: "",
        telefone: "",
        email: "",
      });
    }
  }, [investidorId, form]);

  const onSubmit = async (data: InvestidorFormData) => {
    try {
      const submitData = {
        nome_investidor: data.nome_investidor,
        documento: data.documento.replace(/\D/g, ''),
        telefone: data.telefone ? data.telefone.replace(/\D/g, '') : null,
        email: data.email || null,
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
            status: 'draft',
            session_id: crypto.randomUUID(),
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
              name="nome_investidor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Investidor</FormLabel>
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
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <InputMask
                        {...field}
                        mask={field.value.length <= 14 ? "999.999.999-99" : "99.999.999/9999-99"}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
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
                    <div className="relative">
                      <InputMask
                        {...field}
                        mask="(99) 99999-9999"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
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

            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}