
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const generateChartImage = async (data: any[], config: { 
  width: number;
  height: number;
  dataKey: string;
  yAxisLabel: string;
  formatter?: (value: number) => string;
}) => {
  const chartCanvas = document.createElement('canvas');
  chartCanvas.width = config.width;
  chartCanvas.height = config.height;
  const ctx = chartCanvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Fill 12 months of data, using empty values for missing months
  const now = new Date();
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i);
    const existingData = data.find(d => 
      d.month === date.getMonth() + 1 && 
      d.year === date.getFullYear()
    );
    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      [config.dataKey]: existingData ? existingData[config.dataKey] : 0
    };
  }).reverse();

  const maxValue = Math.max(...last12Months.map(item => item[config.dataKey]));
  const barWidth = (config.width - 60) / 12; // Always show 12 bars
  const barHeightRatio = (config.height - 60) / (maxValue || 1); // Prevent division by zero

  // Draw axes
  ctx.beginPath();
  ctx.strokeStyle = '#E5E7EB'; // Light gray for grid
  ctx.lineWidth = 0.5;
  
  // Draw horizontal grid lines
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = config.height - 30 - ((config.height - 60) * (i / gridLines));
    ctx.moveTo(30, y);
    ctx.lineTo(config.width - 30, y);
    ctx.stroke();
  }

  // Draw vertical grid lines
  last12Months.forEach((_, index) => {
    const x = 40 + (index * barWidth);
    ctx.moveTo(x, 30);
    ctx.lineTo(x, config.height - 30);
    ctx.stroke();
  });

  // Draw bars
  last12Months.forEach((item, index) => {
    const barHeight = item[config.dataKey] * barHeightRatio;
    ctx.fillStyle = '#0EA5E9';
    ctx.fillRect(
      40 + (index * barWidth),
      config.height - 30 - barHeight,
      barWidth - 10,
      barHeight
    );

    // Draw month labels
    ctx.save();
    ctx.translate(45 + (index * barWidth), config.height - 15);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = '#000000';
    ctx.font = '8px Arial';
    ctx.fillText(
      format(new Date(item.year, item.month - 1), 'MMM/yy', { locale: ptBR }),
      0,
      0
    );
    ctx.restore();
  });

  return chartCanvas.toDataURL('image/png');
};
