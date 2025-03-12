
/**
 * Componente para gerenciar os campos de datas do pagamento
 * 
 * Este componente controla as datas de vencimento da concessionária,
 * emissão e vencimento do pagamento, incluindo um calendário para seleção.
 */
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatasSectionProps {
  dataVencimentoConcessionaria: Date | undefined;
  setDataVencimentoConcessionaria: (date: Date | undefined) => void;
  dataEmissao: Date | undefined;
  setDataEmissao: (date: Date | undefined) => void;
  dataVencimento: Date | undefined;
}

export function DatasSection({
  dataVencimentoConcessionaria,
  setDataVencimentoConcessionaria,
  dataEmissao,
  setDataEmissao,
  dataVencimento
}: DatasSectionProps) {
  return (
    <>
      {/* Data Vencimento Concessionária */}
      <div className="space-y-2">
        <Label htmlFor="dataVencimentoConcessionaria">Data Vencimento Concessionária</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="dataVencimentoConcessionaria"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dataVencimentoConcessionaria && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dataVencimentoConcessionaria ? (
                format(dataVencimentoConcessionaria, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                "Selecione uma data"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dataVencimentoConcessionaria}
              onSelect={setDataVencimentoConcessionaria}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Data Emissão */}
      <div className="space-y-2">
        <Label htmlFor="dataEmissao">Data de Emissão</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="dataEmissao"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dataEmissao && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dataEmissao ? (
                format(dataEmissao, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                "Selecione uma data"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dataEmissao}
              onSelect={setDataEmissao}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Data Vencimento (90 dias após emissão) */}
      <div className="space-y-2">
        <Label htmlFor="dataVencimento">Data de Vencimento (90 dias após emissão)</Label>
        <Input
          id="dataVencimento"
          type="text"
          value={dataVencimento ? format(dataVencimento, "dd/MM/yyyy", { locale: ptBR }) : ""}
          disabled
        />
      </div>
    </>
  );
}
