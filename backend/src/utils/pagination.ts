export interface PaginationParams {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getPaginationOptions = (params: PaginationParams) => {
  const page = Math.max(1, parseInt(String(params.page || 1), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(params.limit || 10), 10)));
  const skip = (page - 1) * limit;
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

  return {
    page,
    limit,
    skip,
    sort: { [sortBy]: sortOrder } as Record<string, 1 | -1>,
  };
};

export const buildPaginatedResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginationResult<T> => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
