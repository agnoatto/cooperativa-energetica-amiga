
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UseFormReturn } from "react-hook-form";
import { UsinaFormData } from "./schema";
import { DadosPagamentoFields } from "./DadosPagamentoFields";

interface DadosPagamentoCollapsibleProps {
  form: UseFormReturn<UsinaFormData>;
}

export function DadosPagamentoCollapsible({ form }: DadosPagamentoCollapsibleProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="dados-pagamento">
        <AccordionTrigger>Dados de Pagamento</AccordionTrigger>
        <AccordionContent>
          <DadosPagamentoFields form={form} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
