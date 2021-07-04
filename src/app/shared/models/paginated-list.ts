export interface PaginatedListModel<Type> {
  results: Type[];
  pageIndex: number;
  totalPages: number;
  count: number;
  total: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
