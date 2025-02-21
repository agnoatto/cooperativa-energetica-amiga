
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../theme';
import { FONTS, COLORS } from '../theme';

interface InfoItem {
  label: string;
  value: string;
  highlight?: boolean;
  bold?: boolean;
}

interface PDFInfoBoxProps {
  items: InfoItem[];
}

export const PDFInfoBox: React.FC<PDFInfoBoxProps> = ({ items }) => (
  <View style={styles.infoBox}>
    {items.map((item, index) => (
      <View key={index} style={{ flexDirection: 'row', marginBottom: 3 }}>
        <Text style={{ 
          width: '30%', 
          fontSize: FONTS.NORMAL,
          fontWeight: item.bold ? 'bold' : 'normal'
        }}>
          {item.label}:
        </Text>
        <Text style={{ 
          flex: 1, 
          fontSize: item.highlight ? FONTS.SUBTITLE : FONTS.NORMAL,
          fontWeight: item.bold ? 'bold' : 'normal',
          color: item.highlight ? COLORS.BLUE : COLORS.BLACK
        }}>
          {item.value}
        </Text>
      </View>
    ))}
  </View>
);
