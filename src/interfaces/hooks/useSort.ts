export interface SortHookReturn {
  sortBy: string;
  direction: SortDirection;
  handleSort: (field: string) => void;
}

export interface SortDirection {
  field: string;
  direction: string;
}
