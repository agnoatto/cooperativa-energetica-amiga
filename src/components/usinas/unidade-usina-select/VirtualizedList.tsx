
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

interface UnidadeUsina {
  id: string;
  numero_uc: string;
  logradouro: string;
  numero: string;
}

interface VirtualizedListProps {
  items: UnidadeUsina[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function VirtualizedList({ items, selectedId, onSelect }: VirtualizedListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  return (
    <div 
      ref={parentRef} 
      className="max-h-[300px] overflow-y-auto bg-popover"
    >
      {items.length === 0 ? (
        <div className="py-6 text-center text-sm text-muted-foreground">
          Nenhuma unidade encontrada.
        </div>
      ) : (
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const unidade = items[virtualRow.index];
            return (
              <div
                key={unidade.id}
                className={cn(
                  "absolute left-0 top-0 w-full cursor-pointer px-3 py-2 hover:bg-accent",
                  unidade.id === selectedId && "bg-accent"
                )}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={() => onSelect(unidade.id)}
              >
                <div className="flex items-center justify-between">
                  <span>
                    UC {unidade.numero_uc} - {unidade.logradouro || ''}, {unidade.numero || ''}
                  </span>
                  {unidade.id === selectedId && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
