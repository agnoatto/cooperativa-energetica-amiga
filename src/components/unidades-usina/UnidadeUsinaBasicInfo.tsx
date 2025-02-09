
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BasicInfoFieldsProps } from "./types";

export function UnidadeUsinaBasicInfo({ form, investidores }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
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
        name="titular_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titular</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o titular" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {investidores?.map((investidor) => (
                  <SelectItem key={investidor.id} value={investidor.id}>
                    {investidor.nome_investidor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
