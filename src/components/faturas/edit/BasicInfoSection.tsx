
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { DataProximaLeituraField } from "./DataProximaLeituraField";

interface BasicInfoSectionProps {
  formState: UseFormReturn<any>;
}

export function BasicInfoSection({ formState }: BasicInfoSectionProps) {
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <DataProximaLeituraField formState={formState} />
    </div>
  );
}
