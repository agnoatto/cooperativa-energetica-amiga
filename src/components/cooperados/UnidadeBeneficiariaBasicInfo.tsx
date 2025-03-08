
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { CalculoFaturaTemplate } from '@/types/template';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CurrencyInput } from '@/components/faturas/CurrencyInput';
import { Textarea } from '@/components/ui/textarea';
import { FormDescription } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { convertLocalToUTC, convertUTCToLocal } from '@/utils/dateFormatters';

export function UnidadeBeneficiariaBasicInfo({ form }) {
  const [templates, setTemplates] = useState<CalculoFaturaTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  useEffect(() => {
    async function fetchTemplates() {
      setIsLoadingTemplates(true);
      try {
        const { data, error } = await supabase.rpc('get_all_calculo_fatura_templates');
        
        if (error) {
          console.error("Erro ao buscar templates:", error);
          return;
        }
        
        setTemplates(data as CalculoFaturaTemplate[]);
      } catch (error) {
        console.error("Erro ao buscar templates de cálculo:", error);
      } finally {
        setIsLoadingTemplates(false);
      }
    }

    fetchTemplates();
  }, []);

  // Encontrar o template padrão
  const defaultTemplate = templates.find(template => template.is_padrao);

  return (
    <div className="grid gap-4 py-4">
      <FormField
        control={form.control}
        name="numero_uc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número da UC</FormLabel>
            <FormControl>
              <Input placeholder="Número da UC" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="apelido"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apelido (opcional)</FormLabel>
            <FormControl>
              <Input placeholder="Apelido para identificação" {...field} />
            </FormControl>
            <FormDescription>
              Um nome para facilitar a identificação desta unidade
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="percentual_desconto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Percentual de Desconto (%)</FormLabel>
            <FormControl>
              <CurrencyInput
                value={field.value}
                onValueChange={field.onChange}
                placeholder="0,00"
                decimalScale={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="data_entrada"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data de Entrada</FormLabel>
            <FormControl>
              <Input
                type="date"
                value={convertUTCToLocal(field.value)}
                onChange={(e) => field.onChange(convertLocalToUTC(e.target.value))}
                className={cn(
                  "w-full",
                  !field.value && "text-muted-foreground"
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="data_saida"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data de Saída (opcional)</FormLabel>
            <FormControl>
              <Input
                type="date"
                value={convertUTCToLocal(field.value)}
                onChange={(e) => field.onChange(convertLocalToUTC(e.target.value))}
                className={cn(
                  "w-full",
                  !field.value && "text-muted-foreground"
                )}
              />
            </FormControl>
            <FormDescription>
              Preencha apenas se a unidade já saiu ou tem data prevista para sair
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="consumo_kwh"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consumo Médio Mensal (kWh)</FormLabel>
            <FormControl>
              <CurrencyInput
                value={field.value}
                onValueChange={field.onChange}
                placeholder="0,00"
                decimalScale={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="calculo_fatura_template_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Template de Cálculo</FormLabel>
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={isLoadingTemplates}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template de cálculo" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.nome} {template.is_padrao && "(Padrão)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Template que será usado para calcular os valores das faturas desta unidade
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
