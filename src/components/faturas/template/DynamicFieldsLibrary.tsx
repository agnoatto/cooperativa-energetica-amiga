
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PdfFieldType } from "@/types/pdf-template";
import { Calculator, Calendar, CreditCard, Table2, Type } from "lucide-react";

interface FieldDefinition {
  type: PdfFieldType;
  label: string;
  key: string;
  icon: React.ReactNode;
  description: string;
}

const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    type: 'text',
    label: 'Número UC',
    key: 'unidade_beneficiaria.numero_uc',
    icon: <Type className="w-4 h-4" />,
    description: 'Número da Unidade Consumidora'
  },
  {
    type: 'currency',
    label: 'Valor Total',
    key: 'valor_total',
    icon: <CreditCard className="w-4 h-4" />,
    description: 'Valor total da fatura'
  },
  {
    type: 'number',
    label: 'Consumo kWh',
    key: 'consumo_kwh',
    icon: <Calculator className="w-4 h-4" />,
    description: 'Consumo em kilowatt-hora'
  },
  {
    type: 'date',
    label: 'Vencimento',
    key: 'data_vencimento',
    icon: <Calendar className="w-4 h-4" />,
    description: 'Data de vencimento'
  },
  {
    type: 'table',
    label: 'Tabela de Valores',
    key: 'valores_detalhados',
    icon: <Table2 className="w-4 h-4" />,
    description: 'Detalhamento dos valores'
  }
];

interface DynamicFieldsLibraryProps {
  onFieldSelect: (field: FieldDefinition) => void;
}

export function DynamicFieldsLibrary({ onFieldSelect }: DynamicFieldsLibraryProps) {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-2">Campos Dinâmicos</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {FIELD_DEFINITIONS.map((field, index) => (
            <div key={field.key}>
              {index > 0 && <Separator className="my-2" />}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onFieldSelect(field)}
              >
                <div className="mr-2">{field.icon}</div>
                <div className="text-left">
                  <div className="font-medium">{field.label}</div>
                  <div className="text-xs text-muted-foreground">{field.description}</div>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
