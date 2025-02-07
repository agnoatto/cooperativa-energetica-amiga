
import { ActionButtons } from "./ActionButtons";
import { PageTitle } from "./PageTitle";

interface FaturasHeaderProps {
  onGerarFaturas: () => void;
  isGenerating: boolean;
}

export function FaturasHeader({ onGerarFaturas, isGenerating }: FaturasHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <PageTitle />
      <ActionButtons 
        onGerarFaturas={onGerarFaturas}
        isGenerating={isGenerating}
      />
    </div>
  );
}
