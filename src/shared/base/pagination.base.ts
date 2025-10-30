export type PagedRequest = {
  page: string;
  limit: string;
  query?: string;
};

export type PagedAndResult<T> = {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
};
