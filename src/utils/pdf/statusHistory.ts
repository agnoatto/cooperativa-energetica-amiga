
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { StatusHistoryEntry } from "@/types/fatura";
import { format } from "date-fns";

export const addStatusHistory = (doc: jsPDF, historico: StatusHistoryEntry[], yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Histórico de Status", SPACING.MARGIN, yPos);
  
  yPos += 15;
  doc.setFontSize(FONTS.NORMAL);

  const lineHeight = 20;
  const circleRadius = 3;
  const timelineX = SPACING.MARGIN + 10;

  historico.forEach((entry, index) => {
    const entryY = yPos + (index * lineHeight);

    // Timeline line
    if (index < historico.length - 1) {
      doc.setDrawColor(COLORS.GRAY[0], COLORS.GRAY[1], COLORS.GRAY[2]);
      doc.line(timelineX, entryY, timelineX, entryY + lineHeight);
    }

    // Status circle
    doc.setFillColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2]);
    doc.circle(timelineX, entryY, circleRadius, 'F');

    // Status text
    doc.text(
      `${entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}`,
      timelineX + 10,
      entryY + 4
    );

    // Date
    doc.setFontSize(FONTS.SMALL);
    doc.text(
      format(new Date(entry.data), 'dd/MM/yyyy HH:mm'),
      timelineX + 80,
      entryY + 4
    );

    // Observation (if exists)
    if (entry.observacao) {
      doc.setFontSize(FONTS.SMALL);
      doc.setTextColor(COLORS.GRAY[0], COLORS.GRAY[1], COLORS.GRAY[2]);
      doc.text(entry.observacao, timelineX + 10, entryY + 12);
    }
  });

  return yPos + (historico.length * lineHeight) + 15;
};
