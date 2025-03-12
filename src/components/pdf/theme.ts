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
  LIGHT_BLUE: '#D3E4FD',
  RED: '#ff0000',
  HIGHLIGHT_BG: '#d7ff8f',
  HEADER_BG: '#1a1f2c',
  SUCCESS_GREEN: '#84cc16',
};

export const FONTS = {
  HEADER: 20,
  TITLE: 14,
  SUBTITLE: 12,
  NORMAL: 10,
  SMALL: 9,
  HIGHLIGHT: 16,
};

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: FONTS.NORMAL,
    color: COLORS.BLACK,
    padding: 0,
  },
  header: {
    backgroundColor: COLORS.HEADER_BG,
    padding: '20px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginRight: 20,
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONTS.HEADER,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.WHITE,
    fontSize: FONTS.SUBTITLE,
    marginTop: 5,
  },
  headerLogo: {
    width: 120,
    height: 40,
  },
  clientInfo: {
    padding: '10px 20px',
    borderBottom: 1,
    borderColor: COLORS.GRAY,
  },
  clientRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  clientLabel: {
    width: '80px',
    fontWeight: 'bold',
  },
  contentSection: {
    padding: '10px 20px',
  },
  sectionHeader: {
    backgroundColor: COLORS.HEADER_BG,
    color: COLORS.WHITE,
    padding: '5px 10px',
    fontSize: FONTS.SUBTITLE,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  highlightBox: {
    backgroundColor: COLORS.HIGHLIGHT_BG,
    padding: '10px 20px',
    margin: '10px 0',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlightItem: {
    alignItems: 'center',
    flex: 1,
  },
  highlightLabel: {
    fontSize: FONTS.SMALL,
    marginBottom: 5,
  },
  highlightValue: {
    fontSize: FONTS.HIGHLIGHT,
    fontWeight: 'bold',
  },
  section: {
    margin: '10px 20px',
  },
  sectionTitle: {
    backgroundColor: COLORS.HEADER_BG,
    color: COLORS.WHITE,
    padding: '5px 10px',
    fontSize: FONTS.SUBTITLE,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: COLORS.LIGHT_GRAY,
    padding: '10px',
    marginBottom: '10px',
  },
  valoresBox: {
    backgroundColor: COLORS.LIGHT_GRAY,
    padding: '10px',
    marginTop: '5px',
  },
  valoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  valorLabel: {
    flex: 1,
    fontWeight: 'bold',
  },
  valorValue: {
    flex: 1,
    textAlign: 'right',
  },
  text: {
    fontSize: FONTS.NORMAL,
    marginBottom: 5,
  },
  table: {
    width: '100%',
    marginBottom: 10,
  },
  tableHeader: {
    backgroundColor: COLORS.LIGHT_GRAY,
    flexDirection: 'row',
    borderBottomColor: COLORS.GRAY,
    borderBottomWidth: 1,
    padding: '5px 0',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: FONTS.SMALL,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: COLORS.GRAY,
    borderBottomWidth: 1,
    padding: '5px 0',
  },
  tableCell: {
    flex: 1,
    padding: '0 5px',
  },
  tableCellRight: {
    flex: 1,
    padding: '0 5px',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.HIGHLIGHT_BG,
    padding: '10px',
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    padding: '20px',
  },
  footerText: {
    fontSize: FONTS.SMALL,
    textAlign: 'center',
    color: COLORS.GRAY,
  },
  warningBox: {
    backgroundColor: '#4b7931',
    marginTop: 5,
  },
  warningText: {
    textAlign: 'center',
    padding: '10px',
    color: COLORS.WHITE,
    fontSize: FONTS.SMALL,
  },
});
