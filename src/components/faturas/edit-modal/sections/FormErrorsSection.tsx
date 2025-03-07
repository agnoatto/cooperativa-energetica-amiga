
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormErrorsSectionProps {
  errors: Record<string, string>;
}

export function FormErrorsSection({ errors }: FormErrorsSectionProps) {
  if (Object.keys(errors).length === 0) {
    return null;
  }

  console.log('[FormErrorsSection] Exibindo erros do formulário:', errors);

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Por favor, corrija os erros no formulário antes de salvar.
        <ul className="list-disc pl-5 mt-2">
          {Object.values(errors).map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
