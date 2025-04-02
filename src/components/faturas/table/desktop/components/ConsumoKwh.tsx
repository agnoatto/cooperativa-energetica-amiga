
/**
 * Componente para exibir o consumo em kWh
 * 
 * Apresenta o valor de consumo em kilowatt-hora com a unidade de medida.
 */

interface ConsumoKwhProps {
  consumoKwh: number;
}

export function ConsumoKwh({ consumoKwh }: ConsumoKwhProps) {
  return <div className="text-right">{consumoKwh} kWh</div>;
}
