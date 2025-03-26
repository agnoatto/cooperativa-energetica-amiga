
/**
 * Componente para exibir informações do cooperado/cliente na tabela de faturas
 * 
 * Este componente exibe o nome e documento do cooperado com um tooltip
 * contendo informações detalhadas sobre o cliente e sua unidade beneficiária.
 */
import { UnidadeBeneficiaria } from "@/types/fatura";
import { Info } from "lucide-react";
import { formatarDocumento } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClienteInfoProps {
  unidadeBeneficiaria: UnidadeBeneficiaria;
}

export function ClienteInfo({ unidadeBeneficiaria }: ClienteInfoProps) {
  const cooperado = unidadeBeneficiaria.cooperado;
  
  // Formato de exibição do cliente - nome (documento)
  const clienteDisplay = cooperado.documento ? 
    `${cooperado.nome} (${formatarDocumento(cooperado.documento)})` : 
    cooperado.nome;

  return (
    <div className="flex items-center space-x-1">
      <span className="truncate">{clienteDisplay}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="w-80">
            <div className="space-y-2">
              <p className="font-medium">{cooperado.nome}</p>
              {cooperado.documento && (
                <p className="text-sm">Documento: {formatarDocumento(cooperado.documento)}</p>
              )}
              {cooperado.telefone && (
                <p className="text-sm">Telefone: {cooperado.telefone}</p>
              )}
              {cooperado.email && (
                <p className="text-sm">Email: {cooperado.email}</p>
              )}
              <p className="text-sm">Unidade: {unidadeBeneficiaria.numero_uc}</p>
              {unidadeBeneficiaria.apelido && (
                <p className="text-sm">Apelido: {unidadeBeneficiaria.apelido}</p>
              )}
              <p className="text-sm">Endereço: {unidadeBeneficiaria.endereco}</p>
              <p className="text-xs text-muted-foreground">Desconto: {unidadeBeneficiaria.percentual_desconto}%</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
