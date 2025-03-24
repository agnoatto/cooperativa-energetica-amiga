
/**
 * Componente de estado de carregamento para cartões de lançamentos
 * 
 * Exibe esqueletos de cartões de lançamento durante o carregamento dos dados
 */
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LancamentosLoadingState() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end">
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
