
// Este componente apresenta os dados de pagamento da usina
// Exibe informações bancárias e de contato para pagamento

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { UsinaData } from "../types";

interface UsinaDadosPagamentoProps {
  usina: UsinaData;
}

export function UsinaDadosPagamento({ usina }: UsinaDadosPagamentoProps) {
  const temDadosPagamento = !!(
    usina.dados_pagamento_nome ||
    usina.dados_pagamento_documento ||
    usina.dados_pagamento_banco ||
    usina.dados_pagamento_agencia ||
    usina.dados_pagamento_conta ||
    usina.dados_pagamento_chave_pix
  );

  if (!temDadosPagamento) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          <span>Dados de Pagamento</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usina.dados_pagamento_nome && (
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{usina.dados_pagamento_nome}</p>
            </div>
          )}
          
          {usina.dados_pagamento_documento && (
            <div>
              <p className="text-sm text-muted-foreground">Documento</p>
              <p className="font-medium">{usina.dados_pagamento_documento}</p>
            </div>
          )}
          
          {usina.dados_pagamento_banco && (
            <div>
              <p className="text-sm text-muted-foreground">Banco</p>
              <p className="font-medium">{usina.dados_pagamento_banco}</p>
            </div>
          )}
          
          {(usina.dados_pagamento_agencia || usina.dados_pagamento_conta) && (
            <div>
              <p className="text-sm text-muted-foreground">Agência / Conta</p>
              <p className="font-medium">
                {usina.dados_pagamento_agencia && `Ag: ${usina.dados_pagamento_agencia}`}
                {usina.dados_pagamento_agencia && usina.dados_pagamento_conta && ' / '}
                {usina.dados_pagamento_conta && `Conta: ${usina.dados_pagamento_conta}`}
              </p>
            </div>
          )}
          
          {usina.dados_pagamento_chave_pix && (
            <div>
              <p className="text-sm text-muted-foreground">
                Chave PIX ({usina.dados_pagamento_tipo_chave_pix || 'Não especificada'})
              </p>
              <p className="font-medium">{usina.dados_pagamento_chave_pix}</p>
            </div>
          )}
          
          {usina.dados_pagamento_telefone && (
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{usina.dados_pagamento_telefone}</p>
            </div>
          )}
          
          {usina.dados_pagamento_email && (
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{usina.dados_pagamento_email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
