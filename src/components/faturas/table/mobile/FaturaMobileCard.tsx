/**
 * Card de fatura para visualização mobile
 * 
 * Este componente exibe as informações de uma fatura em formato de card,
 * otimizado para visualização em dispositivos móveis. A data de próxima leitura
 * é exibida conforme programado no mês anterior. Inclui informações detalhadas
 * do cooperado e unidade beneficiária.
 */
import { useState } from "react";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { 
  Calendar, 
  FileText, 
  User, 
  Zap, 
  DollarSign,
  CalendarClock,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusTransitionButtons } from "../../StatusTransitionButtons";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { Separator } from "@/components/ui/separator";
import { FaturaActionsMenu } from "../FaturaActionsMenu";
import { formatarDocumento } from "@/utils/formatters";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FaturaMobileCardProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf: (fatura: Fatura) => void;
}

export function FaturaMobileCard({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewPdf
}: FaturaMobileCardProps) {
  const [expandActions, setExpandActions] = useState(false);
  const [expandDetails, setExpandDetails] = useState(false);

  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const cooperado = fatura.unidade_beneficiaria.cooperado;
  const unidade = fatura.unidade_beneficiaria;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-medium">UC {fatura.unidade_beneficiaria.numero_uc}</span>
            {unidade.apelido && (
              <span className="ml-2 text-sm text-muted-foreground">({unidade.apelido})</span>
            )}
          </div>
          <FaturaStatusBadge fatura={fatura} />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2" />
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
          
          <Separator className="my-1" />
          
          <div className="flex items-center">
            <Zap className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm">{fatura.consumo_kwh || 0} kWh</span>
          </div>
          
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm">{formatCurrency(fatura.valor_assinatura || 0)}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm">Vencimento: {formatDateToPtBR(fatura.data_vencimento)}</span>
          </div>
          
          {fatura.data_proxima_leitura && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-green-600">
                    <CalendarClock className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Próx. Leitura: {formatDateToPtBR(fatura.data_proxima_leitura)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Leitura programada para esta data</p>
                  <p className="text-xs text-gray-500">Esta data foi programada no mês anterior</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-gray-500 mr-2" />
            {fatura.arquivo_concessionaria_path ? (
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary" 
                onClick={() => onViewPdf(fatura)}
              >
                Ver fatura concessionária
              </Button>
            ) : (
              <span className="text-sm text-gray-400">Arquivo não anexado</span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-0 border-t">
        <div className="w-full">
          {expandActions ? (
            <div className="p-3 space-y-2">
              <StatusTransitionButtons 
                fatura={fatura} 
                onUpdateStatus={onUpdateStatus}
                size="sm"
                direction="column"
                className="w-full"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => setExpandActions(false)}
              >
                Mostrar menos
              </Button>
            </div>
          ) : (
            <div className="p-3 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandActions(true)}
              >
                Ações de Status
              </Button>
              
              <div className="flex gap-2">
                <FaturaActionsMenu
                  fatura={fatura}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onUpdateStatus={onUpdateStatus}
                />
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
