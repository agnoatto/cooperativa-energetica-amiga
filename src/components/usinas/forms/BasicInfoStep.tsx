
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { InvestidorSelect } from "../InvestidorSelect";
import { UnidadeUsinaSelect } from "../UnidadeUsinaSelect";
import { UsinaFormData } from "../schema";

interface BasicInfoStepProps {
  form: UseFormReturn<UsinaFormData>;
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <InvestidorSelect form={form} />
        <UnidadeUsinaSelect form={form} />
      </div>
    </div>
  );
}
