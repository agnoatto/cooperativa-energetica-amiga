
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface UsinasHeaderProps {
  onAddClick: () => void;
}

export function UsinasHeader({ onAddClick }: UsinasHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Usinas</h1>
      <Button onClick={onAddClick} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar
      </Button>
    </div>
  );
}
