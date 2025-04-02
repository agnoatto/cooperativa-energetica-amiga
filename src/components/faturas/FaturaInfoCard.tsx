
/**
 * Componente de informação sobre o fluxo de faturas
 * 
 * Exibe um card informativo explicando o novo fluxo de controle
 * onde as faturas são gerenciadas no módulo Faturas até o envio,
 * e após isso o controle passa para o módulo Financeiro.
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export function FaturaInfoCard() {
  return (
    <Card className="bg-white border-blue-100">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg text-blue-700">Novo Fluxo de Controle</CardTitle>
        </div>
        <CardDescription>
          Importante: Mudança no processo de gestão de faturas
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-blue-700">
        <p>
          O módulo <strong>Faturas</strong> agora gerencia apenas as etapas iniciais do ciclo de vida da fatura: 
          <span className="font-semibold"> criação, correção e envio ao cliente</span>.
        </p>
        <p className="mt-2">
          Após o envio da fatura ao cliente, as alterações de status como <span className="font-semibold">pagamento e finalização</span> 
          são gerenciadas exclusivamente pelo módulo <strong>Financeiro</strong> (Contas a Receber).
        </p>
      </CardContent>
    </Card>
  );
}
