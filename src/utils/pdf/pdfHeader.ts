import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '@/components/pdf/constants';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const PDFHeader: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <View style={styles.header}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text>{subtitle}</Text>}
  </View>
);
