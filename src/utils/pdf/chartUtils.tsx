
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatCurrency } from "../pdfUtils";
import React from 'react';
import ReactDOMServer from 'react-dom/server';

export const generateChartImage = async (data: any[], config: { 
  width: number;
  height: number;
  dataKey: string;
  yAxisLabel: string;
  formatter?: (value: number) => string;
}) => {
  // Fill 12 months of data
  const now = new Date();
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i);
    const existingData = data.find(d => 
      d.mes === date.getMonth() + 1 && 
      d.ano === date.getFullYear()
    );
    return {
      date,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      [config.dataKey]: existingData ? existingData[config.dataKey] : 0
    };
  }).reverse();

  // Create a container div for Recharts
  const container = document.createElement('div');
  container.style.width = `${config.width}px`;
  container.style.height = `${config.height}px`;
  document.body.appendChild(container);

  // Define chart component
  const ChartComponent = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={last12Months}
        margin={{ top: 20, right: 30, left: 40, bottom: 25 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          tickFormatter={(date: Date) => format(date, 'MMM/yy', { locale: ptBR })}
          tick={{ fill: '#6B7280', fontSize: 10 }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={config.formatter || ((value: number) => value.toLocaleString('pt-BR'))}
          tick={{ fill: '#6B7280', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Bar
          dataKey={config.dataKey}
          fill="#4F46E5"
          radius={[2, 2, 0, 0]}
          label={{
            position: 'top',
            fill: '#4B5563',
            fontSize: 10,
            formatter: config.formatter || ((value: any) => value.toLocaleString('pt-BR')),
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // Convert chart to SVG string using ReactDOMServer
  const svgString = ReactDOMServer.renderToString(<ChartComponent />);

  // Clean up
  document.body.removeChild(container);

  // Convert SVG to image
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
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
