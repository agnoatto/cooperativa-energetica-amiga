
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const PDFHeader: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
    </View>
  </View>
);
