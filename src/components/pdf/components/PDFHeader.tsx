
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from '../theme';

interface PDFHeaderProps {
  title: string;
  logoUrl?: string;
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ title, logoUrl }) => (
  <View style={styles.header}>
    {logoUrl && <Image style={styles.logo} src={logoUrl} />}
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);
