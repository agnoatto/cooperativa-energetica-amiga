
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  documento: z.string().min(1, "CNPJ é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

export function CooperativaForm() {
  const { toast } = useToast();

  const { data: cooperativa } = useQuery({
    queryKey: ["cooperativa"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cooperativas")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: cooperativa?.nome || "",
      documento: cooperativa?.documento || "",
      email: cooperativa?.email || "",
      telefone: cooperativa?.telefone || "",
      tipo: cooperativa?.tipo || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase
        .from("cooperativas")
        .update(values)
        .eq("id", cooperativa?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Configurações atualizadas",
        description: "As configurações da cooperativa foram atualizadas com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar configurações",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Cooperativa</FormLabel>
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
                  <FormLabel>CNPJ</FormLabel>
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
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Salvar alterações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
