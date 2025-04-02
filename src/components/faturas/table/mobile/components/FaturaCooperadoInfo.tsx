
/**
 * Componente de informações do cooperado
 * 
 * Exibe os dados do cooperado associado à fatura, incluindo
 * nome, documento, contatos e endereço da unidade.
 */
import { Fatura } from "@/types/fatura";
import { formatarDocumento } from "@/utils/formatters";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Phone, Mail, MapPin } from "lucide-react";

interface FaturaCooperadoInfoProps {
  fatura: Fatura;
}

export function FaturaCooperadoInfo({ fatura }: FaturaCooperadoInfoProps) {
  const [expandDetails, setExpandDetails] = useState(false);
  const cooperado = fatura.unidade_beneficiaria.cooperado;
  const unidade = fatura.unidade_beneficiaria;

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-sm font-medium">{cooperado.nome}</span>
      </div>
      
      {cooperado.documento && (
        <div className="flex items-center ml-6 text-xs text-gray-600">
          <span>Documento: {formatarDocumento(cooperado.documento)}</span>
        </div>
      )}
      
      <Collapsible open={expandDetails} onOpenChange={setExpandDetails} className="w-full">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-primary ml-6">
            {expandDetails ? "Ver menos detalhes" : "Ver mais detalhes"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-6 space-y-2 mt-2">
          {cooperado.telefone && (
            <div className="flex items-center text-xs">
              <Phone className="h-3 w-3 text-gray-500 mr-2" />
              <span>{cooperado.telefone}</span>
            </div>
          )}
          
          {cooperado.email && (
            <div className="flex items-center text-xs">
              <Mail className="h-3 w-3 text-gray-500 mr-2" />
              <span>{cooperado.email}</span>
            </div>
          )}
          
          <div className="flex items-center text-xs">
            <MapPin className="h-3 w-3 text-gray-500 mr-2" />
            <span>{unidade.endereco}</span>
          </div>
          
          <div className="flex items-center text-xs">
            <span className="text-gray-500 mr-2">Desconto:</span>
            <span>{unidade.percentual_desconto}%</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
