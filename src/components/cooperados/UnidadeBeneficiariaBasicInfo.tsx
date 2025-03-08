
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { CalculoFaturaTemplate } from "@/types/template";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchTemplates } from "@/components/configuracoes/services/templateService";
import { UseFormReturn } from "react-hook-form";
import { UnidadeBeneficiariaFormValues } from "./schema";

interface UnidadeBeneficiariaBasicInfoProps {
  form: UseFormReturn<UnidadeBeneficiariaFormValues>;
}

export function UnidadeBeneficiariaBasicInfo({ form }: UnidadeBeneficiariaBasicInfoProps) {
  const [templates, setTemplates] = useState<CalculoFaturaTemplate[]>([]);
  const [defaultTemplateId, setDefaultTemplateId] = useState<string | undefined>();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await fetchTemplates();
        
        setTemplates(templatesData);
        
        // Definir o template padrão (se houver)
        const defaultTemplate = templatesData.find(t => t.is_padrao);
        if (defaultTemplate) {
          setDefaultTemplateId(defaultTemplate.id);
        }
      } catch (error) {
        console.error("Erro ao carregar templates:", error);
      }
    };

    loadTemplates();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="numero_uc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número da UC*</FormLabel>
            <FormControl>
              <Input placeholder="Número da Unidade Consumidora" {...field} />
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
            <FormLabel>Apelido</FormLabel>
            <FormControl>
              <Input placeholder="Apelido para identificação" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="percentual_desconto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Percentual de Desconto*</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Ex: 15" 
                {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))} 
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
              onValueChange={field.onChange} 
              defaultValue={field.value || defaultTemplateId} 
              value={field.value || defaultTemplateId}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template de cálculo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.nome} {template.is_padrao ? "(Padrão)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Define como os valores de desconto e assinatura serão calculados
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
