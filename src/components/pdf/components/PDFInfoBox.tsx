
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../theme';

interface InfoItem {
  label: string;
  value: string;
}

interface PDFInfoBoxProps {
  items: InfoItem[];
}

export const PDFInfoBox: React.FC<PDFInfoBoxProps> = ({ items }) => (
  <View style={styles.infoBox}>
    {items.map((item, index) => (
      <View key={index} style={{ flexDirection: 'row', marginBottom: 3 }}>
        <Text style={{ width: '30%', fontSize: styles.table.fontSize }}>{item.label}: </Text>
        <Text style={{ flex: 1, fontSize: styles.table.fontSize }}>{item.value}</Text>
      </View>
    ))}
  </View>
);
