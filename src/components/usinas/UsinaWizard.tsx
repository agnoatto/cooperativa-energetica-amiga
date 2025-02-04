import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Steps } from "@/components/ui/steps";
import { supabase } from "@/integrations/supabase/client";
import { InvestidorWizardForm } from "./InvestidorWizardForm";
import { UnidadeWizardForm } from "./UnidadeWizardForm";
import { UsinaWizardForm } from "./UsinaWizardForm";

interface UsinaWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UsinaWizard({ open, onOpenChange, onSuccess }: UsinaWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [investidorId, setInvestidorId] = useState<string>();
  const [unidadeId, setUnidadeId] = useState<string>();

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

  const handleCancel = async () => {
    try {
      await Promise.all([
        supabase
          .from("investidores")
          .delete()
          .eq("session_id", sessionId)
          .eq("status", "draft"),
        supabase
          .from("unidades_usina")
          .delete()
          .eq("session_id", sessionId)
          .eq("status", "draft"),
        supabase
          .from("usinas")
          .delete()
          .eq("session_id", sessionId)
          .eq("status", "draft"),
      ]);
    } catch (error) {
      console.error("Error cleaning up draft records:", error);
    }

    setCurrentStep(0);
    setInvestidorId(undefined);
    setUnidadeId(undefined);
    onOpenChange(false);
  };

  const handleComplete = () => {
    onSuccess();
    handleCancel();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="space-y-6">
          <Steps currentStep={currentStep} steps={steps} />

          <div className="mt-8">
            {currentStep === 0 && (
              <InvestidorWizardForm
                sessionId={sessionId}
                onNext={(id) => {
                  setInvestidorId(id);
                  handleNext();
                }}
              />
            )}

            {currentStep === 1 && investidorId && (
              <UnidadeWizardForm
                sessionId={sessionId}
                investidorId={investidorId}
                onNext={(id) => {
                  setUnidadeId(id);
                  handleNext();
                }}
              />
            )}

            {currentStep === 2 && investidorId && unidadeId && (
              <UsinaWizardForm
                sessionId={sessionId}
                investidorId={investidorId}
                unidadeId={unidadeId}
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