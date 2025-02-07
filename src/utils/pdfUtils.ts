
import { jsPDF } from "jspdf";

export const addSectionTitle = (doc: jsPDF, text: string, y: number) => {
  doc.setFillColor(25, 64, 175); // bg-blue-700
  doc.rect(20, y - 6, 170, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(text, 25, y);
  doc.setTextColor(0, 0, 0);
};

export const addHighlightedValue = (doc: jsPDF, label: string, value: string, x: number, y: number, width: number = 55) => {
  doc.setFillColor(163, 230, 53); // bg-lime-400
  doc.rect(x, y - 15, width, 20, "F");
  doc.setFontSize(10);
  doc.text(label, x + 2, y - 10);
  doc.setFontSize(12);
  doc.text(value, x + 2, y - 3);
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
