
import { StyleSheet } from '@react-pdf/renderer';

export const COLORS = {
  PRIMARY: '#1a1f2c',
  SECONDARY: '#f2fce2',
  WHITE: '#FFFFFF',
  BLACK: '#222222',
  GRAY: '#808080',
  LIGHT_GRAY: '#f8f9fa',
  GREEN: '#008000',
  BLUE: '#0072CE',
  RED: '#ea384c',
};

export const FONTS = {
  TITLE: 14,
  SUBTITLE: 12,
  NORMAL: 8,
  SMALL: 7,
  HIGHLIGHT: 10,
};

export const SPACING = {
  MARGIN: '10px',
  TOP: '5px',
  PAGE: {
    WIDTH: '210mm',
    HEIGHT: '297mm',
    CONTENT_WIDTH: '180mm',
  },
};

export const styles = StyleSheet.create({
  page: {
    padding: SPACING.MARGIN,
    fontSize: FONTS.NORMAL,
    fontFamily: 'Helvetica',
    backgroundColor: COLORS.WHITE,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: '6px',
    borderRadius: '4px',
  },
  headerContent: {
    padding: '4px',
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONTS.TITLE,
    marginBottom: '2px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.WHITE,
    fontSize: FONTS.SUBTITLE,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: '6px',
    borderRadius: '4px',
  },
  sectionTitle: {
    fontSize: FONTS.SUBTITLE,
    marginBottom: '4px',
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  text: {
    fontSize: FONTS.NORMAL,
    color: COLORS.BLACK,
    marginBottom: '1px',
  },
  infoBox: {
    padding: '6px',
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: '4px',
  },
  valoresBox: {
    padding: '6px',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: '4px',
  },
  valoresRow: {
    flexDirection: 'row',
    marginBottom: '2px',
    alignItems: 'center',
  },
  valorLabel: {
    width: '40%',
    fontSize: FONTS.NORMAL,
    color: COLORS.PRIMARY,
  },
  valorValue: {
    flex: 1,
    fontSize: FONTS.HIGHLIGHT,
    color: COLORS.BLUE,
    fontWeight: 'bold',
  },
  table: {
    width: 'auto',
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderStyle: 'solid',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY,
    borderBottomStyle: 'solid',
    minHeight: '16px',
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: COLORS.PRIMARY,
  },
  tableHeaderText: {
    color: COLORS.WHITE,
    fontSize: FONTS.NORMAL,
    fontWeight: 'bold',
    padding: '3px',
  },
  tableCell: {
    padding: '3px',
    fontSize: FONTS.SMALL,
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 4,
    alignSelf: 'center',
  },
});
