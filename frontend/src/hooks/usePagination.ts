import { useState, useCallback } from 'react';

export interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination({ initialPage = 1, initialLimit = 10 }: UsePaginationProps = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goToPage = useCallback((p: number) => setPage(Math.max(1, p)), []);
  const resetPagination = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    setPage: goToPage,
    setLimit,
    nextPage,
    prevPage,
    resetPagination,
  };
}
