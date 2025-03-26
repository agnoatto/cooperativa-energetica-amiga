
// Este componente apresenta os dados do investidor da usina
// Exibe informações de contato e documentação

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface InvestidorData {
  id?: string;
  nome_investidor?: string;
  documento?: string;
  email?: string;
  telefone?: string;
}

interface UsinaDadosInvestidorProps {
  investidor?: InvestidorData;
}

export function UsinaDadosInvestidor({ investidor }: UsinaDadosInvestidorProps) {
  if (!investidor) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span>Dados do Investidor</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nome</p>
            <p className="font-medium">{investidor.nome_investidor || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Documento</p>
            <p className="font-medium">{investidor.documento || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{investidor.email || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Telefone</p>
            <p className="font-medium">{investidor.telefone || 'Não informado'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
