
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
  const barWidth = (config.width - 80) / 12; // Increased margin for better readability
  const barHeightRatio = (config.height - 80) / (maxValue || 1);

  // Background
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", "100%");
  background.setAttribute("height", "100%");
  background.setAttribute("fill", "#ffffff");
  svg.appendChild(background);

  // Grid lines
  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = config.height - 40 - ((config.height - 80) * (i / gridLines));
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "40");
    line.setAttribute("y1", y.toString());
    line.setAttribute("x2", (config.width - 40).toString());
    line.setAttribute("y2", y.toString());
    line.setAttribute("stroke", "#E5E7EB");
    line.setAttribute("stroke-width", "0.5");
    gridGroup.appendChild(line);

    // Y-axis labels
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const value = maxValue * (i / gridLines);
    label.setAttribute("x", "35");
    label.setAttribute("y", y.toString());
    label.setAttribute("text-anchor", "end");
    label.setAttribute("font-size", "8");
    label.setAttribute("fill", "#6B7280");
    label.textContent = config.formatter ? config.formatter(value) : value.toLocaleString('pt-BR');
    gridGroup.appendChild(label);
  }
  svg.appendChild(gridGroup);

  // Bars with gradient
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  gradient.setAttribute("id", "barGradient");
  gradient.setAttribute("x1", "0");
  gradient.setAttribute("y1", "0");
  gradient.setAttribute("x2", "0");
  gradient.setAttribute("y2", "1");

  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#3B82F6");
  gradient.appendChild(stop1);

  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#60A5FA");
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.appendChild(defs);

  // Bars and labels
  const barsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  last12Months.forEach((item, index) => {
    const barHeight = item[config.dataKey] * barHeightRatio;
    const x = 50 + (index * barWidth);
    const y = config.height - 40 - barHeight;

    // Bar
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", x.toString());
    bar.setAttribute("y", y.toString());
    bar.setAttribute("width", (barWidth - 10).toString());
    bar.setAttribute("height", barHeight.toString());
    bar.setAttribute("fill", "url(#barGradient)");
    bar.setAttribute("rx", "2");
    barsGroup.appendChild(bar);

    // Value label
    if (item[config.dataKey] > 0) {
      const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      valueLabel.setAttribute("x", (x + (barWidth - 10) / 2).toString());
      valueLabel.setAttribute("y", (y - 5).toString());
      valueLabel.setAttribute("text-anchor", "middle");
      valueLabel.setAttribute("font-size", "8");
      valueLabel.setAttribute("fill", "#4B5563");
      const formattedValue = config.formatter 
        ? config.formatter(item[config.dataKey])
        : item[config.dataKey].toLocaleString('pt-BR');
      valueLabel.textContent = formattedValue;
      barsGroup.appendChild(valueLabel);
    }

    // Month label
    const monthLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    monthLabel.setAttribute("x", (x + (barWidth - 10) / 2).toString());
    monthLabel.setAttribute("y", (config.height - 25).toString());
    monthLabel.setAttribute("text-anchor", "middle");
    monthLabel.setAttribute("font-size", "8");
    monthLabel.setAttribute("fill", "#4B5563");
    monthLabel.textContent = format(new Date(item.year, item.month - 1), 'MMM/yy', { locale: ptBR });
    barsGroup.appendChild(monthLabel);
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
      canvas.width = config.width;
      canvas.height = config.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, config.width, config.height);
      ctx.drawImage(img, 0, 0);
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
