
import { jsPDF } from "jspdf";
import { FileText, DollarSign, TrendingUp } from "lucide-react";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const addDivider = (doc: jsPDF, y: number) => {
  doc.setDrawColor(230, 230, 230);
  doc.line(20, y, 190, y);
};
