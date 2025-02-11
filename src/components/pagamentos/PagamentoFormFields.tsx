import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";
import { PagamentoFormValues } from "./types/pagamento";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

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
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dataEmissao = e.target.value;
    const dataPagamento = dataEmissao ? 
      addDays(new Date(dataEmissao), 90).toISOString().split('T')[0] : 
      null;
    
    setForm({
      ...form,
      data_emissao: dataEmissao || null,
      data_pagamento: dataPagamento,
      status: 'pendente'
    });
  };

  const parseCurrencyValue = (value: string): number => {
    // Remove o prefixo "R$ " e mantém apenas dígitos, vírgula e ponto
    const cleanValue = value.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    // Converte para número mantendo 4 casas decimais
    return parseFloat(parseFloat(cleanValue).toFixed(4));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="geracao_kwh">Geração (kWh)</Label>
        <Input
          id="geracao_kwh"
          type="number"
          value={form.geracao_kwh || ''}
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
            const numericValue = parseCurrencyValue(value);
            setForm({ ...form, tusd_fio_b: numericValue });
          }}
        />
      </div>
      <div>
        <Label htmlFor="valor_bruto">Valor Bruto (R$)</Label>
        <Input
          id="valor_bruto"
          type="text"
          value={valorBruto.toLocaleString('pt-BR', { 
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
        <Label htmlFor="valor_concessionaria">Valor Fatura Concessionária (R$)</Label>
        <CurrencyInput
          id="valor_concessionaria"
          value={form.valor_concessionaria}
          onChange={(value) => {
            const numericValue = parseCurrencyValue(value);
            setForm({ ...form, valor_concessionaria: numericValue });
          }}
        />
      </div>
      <div>
        <Label htmlFor="valor_efetivo">Valor Efetivo a Receber (R$)</Label>
        <Input
          id="valor_efetivo"
          type="text"
          value={valorEfetivo.toLocaleString('pt-BR', { 
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
        <Label htmlFor="data_emissao">Data de Emissão da Conta</Label>
        <Input
          id="data_emissao"
          type="date"
          value={form.data_emissao || ''}
          onChange={handleDateChange}
          className={cn(
            "w-full",
            !form.data_emissao && "text-muted-foreground"
          )}
        />
      </div>
      <div>
        <Label htmlFor="data_pagamento">Data de Pagamento Prevista</Label>
        <Input
          id="data_pagamento"
          type="text"
          value={form.data_pagamento ? 
            format(new Date(form.data_pagamento), "dd/MM/yyyy", { locale: ptBR }) : 
            'Aguardando data de emissão'
          }
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
