
import { StyleSheet } from '@react-pdf/renderer';

// Cores consistentes com o design system atual
export const COLORS = {
  PRIMARY: '#1a1f2c',
  SECONDARY: '#f2fce2',
  WHITE: '#FFFFFF',
  BLACK: '#222222',
  GRAY: '#808080',
  GREEN: '#008000',
  BLUE: '#0072CE',
  RED: '#ea384c',
};

// Fontes padronizadas
export const FONTS = {
  TITLE: 13,
  SUBTITLE: 10,
  NORMAL: 7.5,
  SMALL: 6,
};

// Espaçamentos consistentes
export const SPACING = {
  MARGIN: '20px',
  TOP: '15px',
  PAGE: {
    WIDTH: '210mm',
    HEIGHT: '297mm',
    CONTENT_WIDTH: '170mm',
  },
};

// Estilos base para documentos PDF
export const styles = StyleSheet.create({
  page: {
    padding: SPACING.MARGIN,
    fontSize: FONTS.NORMAL,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.TOP,
    marginBottom: '10px',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONTS.TITLE,
    marginLeft: '40px',
  },
  logo: {
    width: '35px',
    height: '18px',
  },
  section: {
    marginBottom: '10px',
    padding: '5px',
  },
  sectionTitle: {
    fontSize: FONTS.SUBTITLE,
    marginBottom: '5px',
    color: COLORS.BLACK,
  },
  text: {
    fontSize: FONTS.NORMAL,
    color: COLORS.BLACK,
    marginBottom: '5px',
  },
  table: {
    width: 'auto',
    marginBottom: '10px',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY,
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: '24px',
  },
  tableHeader: {
    backgroundColor: COLORS.SECONDARY,
  },
  tableCell: {
    padding: '3px 5px',
  },
  infoBox: {
    backgroundColor: COLORS.SECONDARY,
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '3px',
  },
  highlight: {
    color: COLORS.GREEN,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    padding: SPACING.MARGIN,
    textAlign: 'center',
    fontSize: FONTS.SMALL,
  },
});
