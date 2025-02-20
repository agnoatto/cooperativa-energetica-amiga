
export interface FileUploadHookProps {
  pagamentoId: string;
  onSuccess: () => void;
  onFileChange?: () => void;
}

export interface FileUploadState {
  isUploading: boolean;
  isDragging: boolean;
  showPdfPreview: boolean;
  pdfUrl: string | null;
}
