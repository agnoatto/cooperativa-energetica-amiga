
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";
import { PagamentoFormValues } from "./types/pagamento";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PagamentoFormFieldsProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
  valorKwh: number;
  valorBruto: number;
  valorEfetivo: number;
}

export function PagamentoFormFields({
  form,
  setForm,
  valorKwh,
  valorBruto,
  valorEfetivo,
}: PagamentoFormFieldsProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    form.data_emissao ? new Date(form.data_emissao) : undefined
  );

  const handleDataEmissaoChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirmDate = () => {
    if (selectedDate) {
      // Format the date for database (YYYY-MM-DD)
      const data_emissao = selectedDate.toISOString().split('T')[0];
      const data_pagamento = addDays(selectedDate, 90).toISOString().split('T')[0];
      
      setForm({
        ...form,
        data_emissao,
        data_pagamento,
        status: 'pendente'
      });
      
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="geracao_kwh">Geração (kWh)</Label>
        <Input
          id="geracao_kwh"
          type="number"
          value={form.geracao_kwh}
          onChange={(e) => setForm({ ...form, geracao_kwh: e.target.valueAsNumber || 0 })}
        />
      </div>
      <div>
        <Label htmlFor="valor_kwh">Valor do kWh (R$)</Label>
        <Input
          id="valor_kwh"
          type="text"
          value={valorKwh.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          })}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="tusd_fio_b">TUSD Fio B (R$)</Label>
        <CurrencyInput
          id="tusd_fio_b"
          value={form.tusd_fio_b}
          onChange={(value) => {
            const numericValue = Number(value.replace(/[^\d,]/g, '').replace(',', '.'));
            setForm({ ...form, tusd_fio_b: numericValue });
          }}
        />
      </div>
      <div>
        <Label htmlFor="valor_bruto">Valor Bruto (R$)</Label>
        <Input
          id="valor_bruto"
          type="text"
          value={valorBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="valor_concessionaria">Valor Fatura Concessionária (R$)</Label>
        <CurrencyInput
          id="valor_concessionaria"
          value={form.valor_concessionaria}
          onChange={(value) => {
            const numericValue = Number(value.replace(/[^\d,]/g, '').replace(',', '.'));
            setForm({ ...form, valor_concessionaria: numericValue });
          }}
        />
      </div>
      <div>
        <Label htmlFor="valor_efetivo">Valor Efetivo a Receber (R$)</Label>
        <Input
          id="valor_efetivo"
          type="text"
          value={valorEfetivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div className="grid gap-2">
        <Label>Data de Emissão da Conta</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !form.data_emissao && "text-muted-foreground"
              )}
            >
              {form.data_emissao ? (
                <>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(form.data_emissao), "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                <>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Selecione a data de emissão</span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDataEmissaoChange}
                initialFocus
                locale={ptBR}
              />
              <div className="mt-4 flex justify-end border-t pt-4">
                <Button
                  onClick={handleConfirmDate}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Confirmar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label>Data de Pagamento Prevista</Label>
        <Input
          type="text"
          value={form.data_pagamento ? format(new Date(form.data_pagamento), "dd/MM/yyyy", { locale: ptBR }) : 'Aguardando data de emissão'}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => setForm({ ...form, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
