
import { PagamentoFormValues } from '../../types/pagamento';

export interface UseFileStateProps {
  pagamentoId: string;
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
}

export interface FileMetadata {
  fileName: string | null;
  filePath: string | null;
  fileType: string | null;
  fileSize: number | null;
}
