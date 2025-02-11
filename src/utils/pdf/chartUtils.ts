
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const generateChartImage = async (data: any[], config: { 
  width: number;
  height: number;
  dataKey: string;
  yAxisLabel: string;
  formatter?: (value: number) => string;
}) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", config.width.toString());
  svg.setAttribute("height", config.height.toString());
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

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
  const yAxisMax = Math.ceil(maxValue * 1.1); // Add 10% padding to max value
  const barWidth = Math.min(35, (config.width - 100) / 12); // Maximum bar width of 35px
  const barGap = 2; // Gap between bars
  const chartHeight = config.height - 60; // Reserve space for labels
  const barHeightRatio = chartHeight / yAxisMax;

  // Background
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", "100%");
  background.setAttribute("height", "100%");
  background.setAttribute("fill", "#ffffff");
  svg.appendChild(background);

  // Grid lines and Y-axis labels
  const gridLines = 8; // Increase number of grid lines
  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  
  for (let i = 0; i <= gridLines; i++) {
    const y = 20 + (chartHeight * (1 - i / gridLines));
    const value = (yAxisMax * i) / gridLines;

    // Grid line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "60");
    line.setAttribute("y1", y.toString());
    line.setAttribute("x2", (config.width - 20).toString());
    line.setAttribute("y2", y.toString());
    line.setAttribute("stroke", "#E5E7EB");
    line.setAttribute("stroke-width", "1");
    gridGroup.appendChild(line);

    // Y-axis label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", "55");
    label.setAttribute("y", y.toString());
    label.setAttribute("text-anchor", "end");
    label.setAttribute("dominant-baseline", "middle");
    label.setAttribute("font-size", "10");
    label.setAttribute("font-family", "Arial");
    label.setAttribute("fill", "#6B7280");
    label.textContent = config.formatter ? config.formatter(value) : value.toLocaleString('pt-BR');
    gridGroup.appendChild(label);
  }
  svg.appendChild(gridGroup);

  // Bars
  const barsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  last12Months.forEach((item, index) => {
    const value = item[config.dataKey];
    const barHeight = value * barHeightRatio;
    const x = 70 + (index * (barWidth + barGap));
    const y = 20 + (chartHeight - barHeight);

    // Bar
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", x.toString());
    bar.setAttribute("y", y.toString());
    bar.setAttribute("width", barWidth.toString());
    bar.setAttribute("height", barHeight.toString());
    bar.setAttribute("fill", "#4F46E5");
    bar.setAttribute("rx", "1");
    barsGroup.appendChild(bar);

    // Month label
    const monthLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    monthLabel.setAttribute("x", (x + barWidth / 2).toString());
    monthLabel.setAttribute("y", (config.height - 25).toString());
    monthLabel.setAttribute("text-anchor", "middle");
    monthLabel.setAttribute("font-size", "10");
    monthLabel.setAttribute("font-family", "Arial");
    monthLabel.setAttribute("fill", "#4B5563");
    monthLabel.textContent = format(new Date(item.year, item.month - 1), 'MMM/yy', { locale: ptBR });
    barsGroup.appendChild(monthLabel);

    // Value label (only show if value > 0)
    if (value > 0) {
      const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      valueLabel.setAttribute("x", (x + barWidth / 2).toString());
      valueLabel.setAttribute("y", (y - 5).toString());
      valueLabel.setAttribute("text-anchor", "middle");
      valueLabel.setAttribute("font-size", "10");
      valueLabel.setAttribute("font-family", "Arial");
      valueLabel.setAttribute("fill", "#4B5563");
      const formattedValue = config.formatter 
        ? config.formatter(value)
        : value.toLocaleString('pt-BR');
      valueLabel.textContent = formattedValue;
      barsGroup.appendChild(valueLabel);
    }
  });
  svg.appendChild(barsGroup);

  // Convert SVG to image
  const svgString = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Double the dimensions for better resolution
      canvas.width = config.width * 2;
      canvas.height = config.height * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.scale(2, 2); // Scale up for better resolution
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, config.width, config.height);
      ctx.drawImage(img, 0, 0, config.width, config.height);
      resolve(canvas.toDataURL('image/png'));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error('Failed to load SVG'));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
};
