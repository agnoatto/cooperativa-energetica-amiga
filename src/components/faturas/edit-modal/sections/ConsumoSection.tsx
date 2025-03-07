
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConsumoSectionProps {
  consumo: string;
  setConsumo: (value: string) => void;
  error?: string;
}

export function ConsumoSection({ consumo, setConsumo, error }: ConsumoSectionProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="consumo" className="font-semibold">
        Consumo (kWh) *
      </Label>
      <Input
        type="number"
        id="consumo"
        value={consumo}
        onChange={(e) => setConsumo(e.target.value)}
        step="0.01"
        min="0"
        required
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
