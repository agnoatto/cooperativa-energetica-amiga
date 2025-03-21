
/**
 * Seção de informações do cliente para o PDF da fatura
 * 
 * Exibe dados completos do cooperado como nome, documento, endereço,
 * contatos e informações da unidade consumidora para melhor identificação.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '@/components/pdf/theme';
import { formatarDocumento } from '@/utils/formatters';

interface ClientInfoSectionProps {
  nome: string;
  documento: string | null;
  endereco: string;
  telefone?: string | null;
  email?: string | null;
  numero_uc?: string;
  apelido?: string | null;
}

export const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ 
  nome, 
  documento, 
  endereco,
  telefone,
  email,
  numero_uc,
  apelido
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
    
    {telefone && (
      <View style={styles.clientRow}>
        <Text style={styles.clientLabel}>Telefone:</Text>
        <Text>{telefone}</Text>
      </View>
    )}
    
    {email && (
      <View style={styles.clientRow}>
        <Text style={styles.clientLabel}>E-mail:</Text>
        <Text>{email}</Text>
      </View>
    )}
    
    <View style={styles.clientRow}>
      <Text style={styles.clientLabel}>Endereço:</Text>
      <Text>{endereco}</Text>
    </View>
    
    {numero_uc && (
      <View style={styles.clientRow}>
        <Text style={styles.clientLabel}>Unidade Consumidora:</Text>
        <Text>{numero_uc} {apelido ? `(${apelido})` : ''}</Text>
      </View>
    )}
  </View>
);
