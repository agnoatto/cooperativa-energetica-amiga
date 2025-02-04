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
  
  const [investidorData, setInvestidorData] = useState<InvestidorData | null>(null);
  const [unidadeData, setUnidadeData] = useState<UnidadeData | null>(null);
  const [usinaData, setUsinaData] = useState<UsinaData | null>(null);
  const [createdInvestidorId, setCreatedInvestidorId] = useState<string | null>(null);

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
    setInvestidorData(null);
    setUnidadeData(null);
    setUsinaData(null);
    setCreatedInvestidorId(null);
    onOpenChange(false);
  };

  const handleComplete = async (usinaFormData: UsinaData) => {
    if (!investidorData || !unidadeData || !createdInvestidorId) {
      toast({
        title: "Erro",
        description: "Dados incompletos. Por favor, preencha todos os passos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create unidade with active status using the created investidor id
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
          titular_id: createdInvestidorId, // Use the created investidor id instead of session_id
          status: 'active',
          session_id: sessionId,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (unidadeError) throw unidadeError;

      // Create usina with active status
      const { error: usinaError } = await supabase
        .from("usinas")
        .insert({
          investidor_id: createdInvestidorId,
          unidade_usina_id: unidade.id,
          valor_kwh: usinaFormData.valor_kwh,
          status: 'active',
          session_id: sessionId,
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

  const handleInvestidorSubmit = async (data: InvestidorData) => {
    try {
      const { data: investidor, error: investidorError } = await supabase
        .from("investidores")
        .insert({
          nome_investidor: data.nome_investidor,
          documento: data.documento.replace(/\D/g, ''),
          telefone: data.telefone ? data.telefone.replace(/\D/g, '') : null,
          email: data.email || null,
          status: 'active',
          session_id: sessionId,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (investidorError) throw investidorError;
      
      setCreatedInvestidorId(investidor.id);
      setInvestidorData(data);
      handleNext();
    } catch (error: any) {
      console.error("Error creating investidor:", error);
      toast({
        title: "Erro ao criar investidor",
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
                onNext={handleInvestidorSubmit}
              />
            )}

            {currentStep === 1 && investidorData && (
              <UnidadeWizardForm
                sessionId={sessionId}
                investidorId={createdInvestidorId!}
                onNext={(data) => {
                  setUnidadeData(data);
                  handleNext();
                }}
              />
            )}

            {currentStep === 2 && investidorData && unidadeData && (
              <UsinaWizardForm
                sessionId={sessionId}
                investidorId={createdInvestidorId!}
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