
/**
 * Seção de informações do cliente para o PDF da fatura
 * 
 * Exibe dados básicos do cooperado como nome, documento e endereço
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '@/components/pdf/theme';
import { formatarDocumento } from '@/utils/formatters';

interface ClientInfoSectionProps {
  nome: string;
  documento: string | null;
  endereco: string;
}

export const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ 
  nome, 
  documento, 
  endereco 
}) => (
  <View style={styles.clientInfo}>
    <View style={styles.clientRow}>
      <Text style={styles.clientLabel}>Cliente:</Text>
      <Text>{nome}</Text>
    </View>
    <View style={styles.clientRow}>
      <Text style={styles.clientLabel}>CPF/CNPJ:</Text>
      <Text>{formatarDocumento(documento || '')}</Text>
    </View>
    <View style={styles.clientRow}>
      <Text style={styles.clientLabel}>Endereço:</Text>
      <Text>{endereco}</Text>
    </View>
  </View>
);
