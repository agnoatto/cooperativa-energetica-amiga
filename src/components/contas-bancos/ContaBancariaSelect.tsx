
/**
 * Componente de Seleção de Conta Bancária
 * 
 * Este componente permite selecionar uma conta bancária através de um 
 * dropdown, exibindo informações como nome, tipo e saldo da conta.
 * É utilizado em formulários de lançamentos financeiros e transferências.
 */
import { useContasBancarias } from "@/hooks/contas-bancos/useContasBancarias";
import { ContaBancaria } from "@/types/contas-bancos";
import { formatarMoeda } from "@/utils/formatters";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CreditCard, Wallet, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ContaBancariaSelectProps {
  value: string;
  onChange: (value: string) => void;
  onContaSelected?: (conta: ContaBancaria | undefined) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  apenasAtivas?: boolean;
  withAll?: boolean;
  allLabel?: string;
  allValue?: string;
}

export function ContaBancariaSelect({
  value,
  onChange,
  onContaSelected,
  placeholder = "Selecione uma conta",
  label,
  className,
  error,
  disabled = false,
  apenasAtivas = true,
  withAll = false,
  allLabel = "Todas as contas",
  allValue = ""
}: ContaBancariaSelectProps) {
  const { data: contas, isLoading } = useContasBancarias({ apenasAtivas });

  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (onContaSelected) {
      const conta = contas.find(c => c.id === newValue);
      onContaSelected(conta);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      
      <Select 
        value={value} 
        onValueChange={handleChange}
        disabled={disabled || contas.length === 0}
      >
        <SelectTrigger className={cn(error && "border-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {withAll && (
            <SelectItem value={allValue}>{allLabel}</SelectItem>
          )}
          
          {contas.map((conta) => (
            <SelectItem key={conta.id} value={conta.id}>
              <div className="flex items-center gap-2">
                {conta.tipo === 'corrente' && <CreditCard className="h-4 w-4 text-blue-500" />}
                {conta.tipo === 'poupanca' && <Wallet className="h-4 w-4 text-green-500" />}
                {conta.tipo === 'investimento' && <BarChart3 className="h-4 w-4 text-purple-500" />}
                {conta.tipo === 'caixa' && <Wallet className="h-4 w-4 text-amber-500" />}
                <span>
                  {conta.nome}
                  <span className="text-xs text-gray-500 ml-2">
                    {formatarMoeda(conta.saldo_atual)}
                  </span>
                </span>
              </div>
            </SelectItem>
          ))}
          
          {contas.length === 0 && (
            <div className="p-2 text-center text-sm text-gray-500">
              Nenhuma conta bancária encontrada
            </div>
          )}
        </SelectContent>
      </Select>
      
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
