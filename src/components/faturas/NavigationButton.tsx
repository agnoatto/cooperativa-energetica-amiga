
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonProps {
  direction: 'previous' | 'next';
  onClick: () => void;
}

export function NavigationButton({ direction, onClick }: NavigationButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
    >
      {direction === 'previous' ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
}
