
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormErrorsSectionProps {
  errors: Record<string, string>;
}

export function FormErrorsSection({ errors }: FormErrorsSectionProps) {
  if (Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Por favor, corrija os erros no formulário antes de salvar.
      </AlertDescription>
    </Alert>
  );
}
