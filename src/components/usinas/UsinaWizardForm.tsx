import React from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const usinaFormSchema = z.object({
  valor_kwh: z.coerce
    .number()
    .min(0, "Valor deve ser maior que zero")
    .nonnegative("Valor não pode ser negativo"),
});

type UsinaFormData = z.infer<typeof usinaFormSchema>;

interface UsinaWizardFormProps {
  sessionId: string;
  investidorId: string;
  unidadeId: string;
  onComplete: (data: UsinaFormData) => void;
}

export function UsinaWizardForm({ 
  sessionId, 
  investidorId, 
  unidadeId, 
  onComplete 
}: UsinaWizardFormProps) {
  const form = useForm<UsinaFormData>({
    resolver: zodResolver(usinaFormSchema),
    defaultValues: {
      valor_kwh: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onComplete)} className="space-y-4">
        <FormField
          control={form.control}
          name="valor_kwh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do kWh</FormLabel>
              <FormControl>
                <Input {...field} type="number" step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Concluir</Button>
      </form>
    </Form>
  );
}