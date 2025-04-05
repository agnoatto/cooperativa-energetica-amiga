
/**
 * Seletor de Conta Bancária
 * 
 * Este componente permite selecionar uma conta bancária para operações financeiras,
 * facilitando a atribuição de transações à conta correta e melhorando o controle financeiro.
 */
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, ChevronsUpDown, Plus, Wallet, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContasBancarias } from "@/hooks/contas-bancos/useContasBancarias";
import { ContaBancaria } from "@/types/contas-bancos";
import { formatarMoeda } from "@/utils/formatters";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

interface ContaBancariaSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowCreation?: boolean;
  onCreateNew?: () => void;
  filtrarTipo?: string[];
  filtrarStatus?: string[];
  className?: string;
}

export function ContaBancariaSelect({
  value,
  onChange,
  placeholder = "Selecione uma conta",
  disabled = false,
  allowCreation = false,
  onCreateNew,
  filtrarTipo,
  filtrarStatus = ["ativa"],
  className,
}: ContaBancariaSelectProps) {
  const [open, setOpen] = useState(false);
  const { data: contas, isLoading } = useContasBancarias();
  
  // Aplicar filtros
  const contasFiltradas = contas?.filter(conta => {
    if (filtrarTipo && filtrarTipo.length > 0) {
      if (!filtrarTipo.includes(conta.tipo)) return false;
    }
    
    if (filtrarStatus && filtrarStatus.length > 0) {
      if (!filtrarStatus.includes(conta.status)) return false;
    }
    
    return true;
  }) || [];
  
  // Se não houver contas ou todas estiverem filtradas
  const semContas = contasFiltradas.length === 0;
  
  const getIconForTipo = (tipo: string) => {
    switch (tipo) {
      case 'corrente':
        return <CreditCard className="h-4 w-4 mr-2 text-blue-600" />;
      case 'poupanca':
        return <Wallet className="h-4 w-4 mr-2 text-green-600" />;
      case 'investimento':
        return <BarChart3 className="h-4 w-4 mr-2 text-purple-600" />;
      case 'caixa':
        return <Wallet className="h-4 w-4 mr-2 text-amber-600" />;
      default:
        return <CreditCard className="h-4 w-4 mr-2 text-gray-600" />;
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          {value && contasFiltradas.find(conta => conta.id === value) ? (
            <>
              {getIconForTipo(contasFiltradas.find(conta => conta.id === value)?.tipo || '')}
              {contasFiltradas.find(conta => conta.id === value)?.nome}
              <div className="ml-2 text-sm text-gray-500">
                ({formatarMoeda(contasFiltradas.find(conta => conta.id === value)?.saldo_atual || 0)})
              </div>
            </>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar conta..." />
          <CommandEmpty>
            {isLoading ? (
              "Carregando contas..."
            ) : semContas ? (
              allowCreation ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Nenhuma conta encontrada</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      if (onCreateNew) onCreateNew();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Nova Conta
                  </Button>
                </div>
              ) : (
                "Nenhuma conta encontrada"
              )
            ) : (
              "Nenhuma conta encontrada"
            )}
          </CommandEmpty>
          <CommandGroup>
            {contasFiltradas.map((conta) => (
              <CommandItem
                key={conta.id}
                value={conta.id}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {getIconForTipo(conta.tipo)}
                    <div>
                      <div>{conta.nome}</div>
                      {conta.tipo !== 'caixa' && conta.banco && (
                        <div className="text-xs text-gray-500">{conta.banco}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-sm mr-2">
                      {formatarMoeda(conta.saldo_atual)}
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === conta.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          
          {allowCreation && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false);
                  if (onCreateNew) onCreateNew();
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova Conta
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
