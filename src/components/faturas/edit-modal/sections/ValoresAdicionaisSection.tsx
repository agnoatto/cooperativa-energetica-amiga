
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "../../CurrencyInput";

interface ValoresAdicionaisSectionProps {
  iluminacaoPublica: string;
  setIluminacaoPublica: (value: string) => void;
  outrosValores: string;
  setOutrosValores: (value: string) => void;
  saldoEnergiaKwh: string;
  setSaldoEnergiaKwh: (value: string) => void;
}

export function ValoresAdicionaisSection({
  iluminacaoPublica,
  setIluminacaoPublica,
  outrosValores,
  setOutrosValores,
  saldoEnergiaKwh,
  setSaldoEnergiaKwh
}: ValoresAdicionaisSectionProps) {
  return (
    <>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="iluminacaoPublica" className="font-semibold">
          Iluminação Pública *
        </Label>
        <CurrencyInput
          id="iluminacaoPublica"
          value={iluminacaoPublica}
          onChange={setIluminacaoPublica}
          required
          decimalScale={2}
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="outrosValores" className="font-semibold">
          Outros Valores *
        </Label>
        <CurrencyInput
          id="outrosValores"
          value={outrosValores}
          onChange={setOutrosValores}
          required
          decimalScale={2}
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="saldoEnergiaKwh" className="font-semibold">
          Saldo de Energia (kWh) *
        </Label>
        <Input
          type="number"
          id="saldoEnergiaKwh"
          value={saldoEnergiaKwh}
          onChange={(e) => setSaldoEnergiaKwh(e.target.value)}
          step="0.01"
          min="0"
          required
        />
      </div>
    </>
  );
}
