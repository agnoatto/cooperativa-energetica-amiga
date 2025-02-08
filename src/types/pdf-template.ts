
export type PdfFieldType = 'text' | 'number' | 'date' | 'currency' | 'table';

export interface PdfField {
  id?: string;
  field_key: string;
  field_type: PdfFieldType;
  field_label: string;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  font_size: number;
  font_family: string;
}

export interface PdfTemplate {
  id?: string;
  name: string;
  description?: string;
  template_data: Record<string, any>;
  is_default: boolean;
  fields?: PdfField[];
}
