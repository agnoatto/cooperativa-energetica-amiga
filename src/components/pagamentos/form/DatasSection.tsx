
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";
import { PagamentoFormValues, PagamentoStatus } from "../types/pagamento";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DatasSectionProps {
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
}

export function DatasSection({ form, setForm }: DatasSectionProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dataEmissao = e.target.value;
    const dataVencimento = dataEmissao ? 
      addDays(new Date(dataEmissao), 90).toISOString().split('T')[0] : 
      null;
    
    setForm({
      ...form,
      data_emissao: dataEmissao || null,
      data_vencimento: dataVencimento,
      status: 'pendente' as PagamentoStatus
    });
  };

  return (
    <>
      <div>
        <Label htmlFor="valor_concessionaria">Valor Fatura Concessionária (R$)</Label>
        <CurrencyInput
          id="valor_concessionaria"
          value={form.valor_concessionaria.toString()}
          onChange={(value) => setForm({ ...form, valor_concessionaria: parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0 })}
          decimalScale={2}
        />
      </div>

      <div>
        <Label htmlFor="data_vencimento_concessionaria">Data de Vencimento da Fatura Concessionária</Label>
        <Input
          id="data_vencimento_concessionaria"
          type="date"
          value={form.data_vencimento_concessionaria || ''}
          onChange={(e) => setForm({ ...form, data_vencimento_concessionaria: e.target.value || null })}
          className={cn(
            "w-full",
            !form.data_vencimento_concessionaria && "text-muted-foreground"
          )}
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
        <Label htmlFor="data_vencimento">Data de Pagamento Prevista</Label>
        <Input
          id="data_vencimento"
          type="text"
          value={form.data_vencimento ? 
            format(new Date(form.data_vencimento), "dd/MM/yyyy", { locale: ptBR }) : 
            'Aguardando data de emissão'
          }
          disabled
          className="bg-gray-100"
        />
      </div>
    </>
  );
}
