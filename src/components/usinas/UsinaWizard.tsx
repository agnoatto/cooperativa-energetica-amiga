import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Steps } from "@/components/ui/steps";
import { supabase } from "@/integrations/supabase/client";
import { InvestidorWizardForm } from "./InvestidorWizardForm";
import { UnidadeWizardForm } from "./UnidadeWizardForm";
import { UsinaWizardForm } from "./UsinaWizardForm";
import { useToast } from "../ui/use-toast";

interface UsinaWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface InvestidorData {
  nome_investidor: string;
  documento: string;
  telefone?: string;
  email?: string;
}

interface UnidadeData {
  numero_uc: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  cidade: string;
  uf: string;
  cep: string;
}

interface UsinaData {
  valor_kwh: number;
}

export function UsinaWizard({ open, onOpenChange, onSuccess }: UsinaWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();
  
  // Form data state
  const [investidorData, setInvestidorData] = useState<InvestidorData>();
  const [unidadeData, setUnidadeData] = useState<UnidadeData>();
  const [usinaData, setUsinaData] = useState<UsinaData>();

  const steps = [
    { title: "Investidor", description: "Selecione ou crie um investidor" },
    { title: "Unidade", description: "Selecione ou crie uma unidade" },
    { title: "Usina", description: "Configure a usina" },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setInvestidorData(undefined);
    setUnidadeData(undefined);
    setUsinaData(undefined);
    onOpenChange(false);
  };

  const handleComplete = async (usinaFormData: UsinaData) => {
    if (!investidorData || !unidadeData) {
      toast({
        title: "Erro",
        description: "Dados incompletos. Por favor, preencha todos os passos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create investidor
      const { data: investidor, error: investidorError } = await supabase
        .from("investidores")
        .insert({
          nome_investidor: investidorData.nome_investidor,
          documento: investidorData.documento.replace(/\D/g, ''),
          telefone: investidorData.telefone ? investidorData.telefone.replace(/\D/g, '') : null,
          email: investidorData.email || null,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (investidorError) throw investidorError;

      // Create unidade
      const { data: unidade, error: unidadeError } = await supabase
        .from("unidades_usina")
        .insert({
          numero_uc: unidadeData.numero_uc,
          logradouro: unidadeData.logradouro,
          numero: unidadeData.numero,
          complemento: unidadeData.complemento,
          cidade: unidadeData.cidade,
          uf: unidadeData.uf,
          cep: unidadeData.cep,
          titular_id: investidor.id,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (unidadeError) throw unidadeError;

      // Create usina
      const { error: usinaError } = await supabase
        .from("usinas")
        .insert({
          investidor_id: investidor.id,
          unidade_usina_id: unidade.id,
          valor_kwh: usinaFormData.valor_kwh,
          status: 'active',
          updated_at: new Date().toISOString(),
        });

      if (usinaError) throw usinaError;

      toast({
        title: "Usina criada com sucesso!",
      });

      onSuccess();
      handleCancel();
    } catch (error: any) {
      console.error("Error saving data:", error);
      toast({
        title: "Erro ao salvar dados",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>Nova Usina</DialogTitle>
        <div className="space-y-6">
          <Steps currentStep={currentStep} steps={steps} />

          <div className="mt-8">
            {currentStep === 0 && (
              <InvestidorWizardForm
                sessionId={sessionId}
                onNext={(data) => {
                  setInvestidorData(data);
                  handleNext();
                }}
              />
            )}

            {currentStep === 1 && investidorData && (
              <UnidadeWizardForm
                sessionId={sessionId}
                investidorId={sessionId}
                onNext={(data) => {
                  setUnidadeData(data);
                  handleNext();
                }}
              />
            )}

            {currentStep === 2 && investidorData && unidadeData && (
              <UsinaWizardForm
                sessionId={sessionId}
                investidorId={sessionId}
                unidadeId={sessionId}
                onComplete={handleComplete}
              />
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Voltar
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}