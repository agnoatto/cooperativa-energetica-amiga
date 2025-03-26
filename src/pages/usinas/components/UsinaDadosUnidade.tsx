
// Este componente apresenta os dados da unidade da usina
// Exibe informações de localização e identificação

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface UnidadeData {
  id?: string;
  numero_uc?: string;
  titular_nome?: string;
  titular_tipo?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
}

interface UsinaDadosUnidadeProps {
  unidade?: UnidadeData;
}

export function UsinaDadosUnidade({ unidade }: UsinaDadosUnidadeProps) {
  if (!unidade) return null;

  function formatarEndereco() {
    const parts = [];
    if (unidade.logradouro) parts.push(unidade.logradouro);
    if (unidade.numero) parts.push(unidade.numero);
    if (unidade.complemento) parts.push(unidade.complemento);
    
    let linha1 = parts.join(', ');
    
    const parts2 = [];
    if (unidade.bairro) parts2.push(unidade.bairro);
    if (unidade.cidade) parts2.push(unidade.cidade);
    if (unidade.uf) parts2.push(unidade.uf);
    
    let linha2 = parts2.join(', ');
    
    return { linha1, linha2, cep: unidade.cep };
  }

  const endereco = formatarEndereco();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <span>Dados da Unidade</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Número UC</p>
          <p className="font-medium">{unidade.numero_uc || 'Não informado'}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Titular</p>
          <p className="font-medium">{unidade.titular_nome || 'Não informado'}</p>
          <p className="text-xs text-muted-foreground">
            {unidade.titular_tipo === 'cooperativa' ? 'Cooperativa' : 'Cooperado'}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Endereço</p>
          <p className="font-medium">{endereco.linha1 || 'Não informado'}</p>
          {endereco.linha2 && <p className="font-medium">{endereco.linha2}</p>}
          {endereco.cep && <p className="font-medium">CEP: {endereco.cep}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
