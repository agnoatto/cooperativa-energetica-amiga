
import { jsPDF } from "jspdf";
import { FileText, DollarSign, TrendingUp } from "lucide-react";

export const addSectionTitle = (doc: jsPDF, text: string, y: number) => {
  doc.setFillColor(26, 31, 44); // #1A1F2C dark purple
  doc.rect(20, y - 6, 170, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(text, 25, y);
  doc.setTextColor(0, 0, 0);
};

export const addHighlightedValue = (doc: jsPDF, label: string, value: string, x: number, y: number, width: number = 55) => {
  // Soft green background
  doc.setFillColor(242, 252, 226); // #F2FCE2
  doc.roundedRect(x, y - 15, width, 20, 2, 2, "F");
  doc.setFontSize(10);
  doc.setTextColor(26, 31, 44); // #1A1F2C
  doc.text(label, x + 2, y - 10);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(value, x + 2, y - 3);
};

export const addValueBox = (doc: jsPDF, title: string, items: Array<{ label: string; value: string }>, x: number, y: number, width: number = 80) => {
  doc.setFillColor(248, 250, 252); // Light gray background
  doc.roundedRect(x, y, width, items.length * 7 + 15, 2, 2, "F");
  
  doc.setFontSize(11);
  doc.setTextColor(26, 31, 44);
  doc.text(title, x + 5, y + 7);
  
  doc.setFontSize(10);
  items.forEach((item, index) => {
    doc.text(`${item.label}: ${item.value}`, x + 5, y + 15 + (index * 7));
  });
};

export const addDivider = (doc: jsPDF, y: number) => {
  doc.setDrawColor(230, 230, 230);
  doc.line(20, y, 190, y);
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
