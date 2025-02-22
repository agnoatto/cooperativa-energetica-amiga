
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
  },
  value: {
    width: '70%',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

// Cabeçalhos para as tabelas do boletim
export const TABLE_HEADERS = {
  historico: [
    'Mês/Ano',
    'Status',
    'Data',
    'Observação'
  ],
  medicoesAnteriores: [
    'Mês/Ano',
    'Geração (kWh)',
    'Valor Base',
    'Valor Total'
  ]
};

// Larguras das colunas para as tabelas
export const COLUMN_WIDTHS = {
  historico: ['25%', '20%', '20%', '35%'],
  medicoesAnteriores: ['25%', '25%', '25%', '25%']
};
