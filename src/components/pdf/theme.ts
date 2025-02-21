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
  TITLE: 16,
  SUBTITLE: 14,
  NORMAL: 10,
  SMALL: 8,
  HIGHLIGHT: 12,
};

export const SPACING = {
  MARGIN: '20px',
  TOP: '15px',
  PAGE: {
    WIDTH: '210mm',
    HEIGHT: '297mm',
    CONTENT_WIDTH: '170mm',
  },
};

export const styles = StyleSheet.create({
  page: {
    padding: SPACING.MARGIN,
    fontSize: FONTS.NORMAL,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.TOP,
    marginBottom: '15px',
    borderRadius: '4px',
  },
  headerContent: {
    padding: '10px 20px',
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONTS.TITLE,
    marginBottom: '5px',
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
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '4px',
  },
  sectionTitle: {
    fontSize: FONTS.SUBTITLE,
    marginBottom: '10px',
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  text: {
    fontSize: FONTS.NORMAL,
    color: COLORS.BLACK,
    marginBottom: '5px',
  },
  infoBox: {
    padding: '10px',
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: '4px',
  },
  valoresBox: {
    padding: '15px',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: '4px',
    marginTop: '5px',
  },
  valoresRow: {
    flexDirection: 'row',
    marginBottom: '8px',
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
    marginTop: '10px',
    border: `1px solid ${COLORS.GRAY}`,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY,
    borderBottomStyle: 'solid',
    minHeight: '30px',
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: COLORS.PRIMARY,
  },
  tableHeaderText: {
    color: COLORS.WHITE,
    fontSize: FONTS.NORMAL,
    fontWeight: 'bold',
    padding: '8px',
  },
  tableCell: {
    padding: '8px',
    fontSize: FONTS.NORMAL,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
});
