export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total_pages: number;
  total: number;
};

export type PaginatedResult<T> = {
  result: T[];
  meta: {
    pagination: PaginationMeta;
  };
};

export type PaginatedQueryParams = {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
  keyword?: string;
};
