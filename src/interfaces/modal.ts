export interface Modal {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface AlertModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  desc?: string;
}
