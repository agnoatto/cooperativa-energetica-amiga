
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface BasicInfoSectionProps {
  formState: UseFormReturn<any>;
  formatDate: (date: string) => string;
}

export function BasicInfoSection({ formState, formatDate }: BasicInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={formState.control}
        name="consumo_kwh"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consumo (kWh)</FormLabel>
            <FormControl>
              <Input placeholder="Consumo em kWh" type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formState.control}
        name="data_vencimento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Vencimento</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
                defaultValue={formatDate(field.value)} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
