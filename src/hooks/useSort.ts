import { useState } from 'react';

import type { SortDirection } from '@/interfaces/hooks/useSort';

function useSort(): SortHookReturn {
  const [direction, setDirection] = useState<SortDirection>({ field: '', direction: '' });
  const [sortBy, setSortBy] = useState<string>('');

  const handleSort = (field: string): void => {
    if (!field) return;

    let newDirection = '';

    if (direction.field !== field || direction.direction === '') {
      newDirection = 'asc';
    } else if (direction.direction === 'asc') {
      newDirection = 'desc';
    } else if (direction.direction === 'desc') {
      newDirection = '';
    }

    setDirection({ field, direction: newDirection });
    const sortParam = newDirection === 'asc' ? field : `-${field}`;

    if (newDirection === '') {
      deleteSort();
    } else {
      handleChangeSort(sortParam);
    }
  };

  const deleteSort = (): void => {
    setSortBy('');
  };

  const handleChangeSort = (field: string): void => {
    setSortBy(field);
  };

  return {
    sortBy: sortBy,
    direction,
    handleSort,
  };
}

export type SortHookReturn = {
  sortBy: string;
  direction: SortDirection;
  handleSort: (field: string) => void;
};

export default useSort;
