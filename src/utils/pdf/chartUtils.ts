
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

  const maxValue = Math.max(...data.map(item => item[config.dataKey]));
  const barWidth = (config.width - 60) / data.length;
  const barHeightRatio = (config.height - 60) / maxValue;

  ctx.beginPath();
  ctx.moveTo(30, 30);
  ctx.lineTo(30, config.height - 30);
  ctx.lineTo(config.width - 30, config.height - 30);
  ctx.stroke();

  data.forEach((item, index) => {
    const barHeight = item[config.dataKey] * barHeightRatio;
    ctx.fillStyle = '#0EA5E9';
    ctx.fillRect(
      40 + (index * barWidth),
      config.height - 30 - barHeight,
      barWidth - 10,
      barHeight
    );

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

