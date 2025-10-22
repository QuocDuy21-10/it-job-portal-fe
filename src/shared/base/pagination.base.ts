export type PagedRequest = {
  page: number;
  size: number;
  filterText?: string;
};

export type PagedAndResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
