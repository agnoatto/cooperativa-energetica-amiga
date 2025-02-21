
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from '../theme';

interface PDFHeaderProps {
  title: string;
  subtitle?: string;
  logoUrl?: string;
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ title, subtitle, logoUrl }) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      {logoUrl && <Image style={styles.logo} src={logoUrl} />}
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
    </View>
  </View>
);
