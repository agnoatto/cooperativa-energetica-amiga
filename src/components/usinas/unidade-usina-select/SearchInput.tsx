
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="flex items-center border-b px-3 pb-2 pt-3">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <Input
        placeholder="Buscar unidade..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 border-0 p-0 focus-visible:ring-0"
      />
      {value && (
        <X
          className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100"
          onClick={() => onChange("")}
        />
      )}
    </div>
  );
}
