
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateSectionProps {
  dataVencimento: string;
  setDataVencimento: (value: string) => void;
  error?: string;
}

export function DateSection({ dataVencimento, setDataVencimento, error }: DateSectionProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="dataVencimento" className="font-semibold">
        Data de Vencimento *
      </Label>
      <Input
        type="date"
        id="dataVencimento"
        value={dataVencimento}
        onChange={(e) => setDataVencimento(e.target.value)}
        required
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
