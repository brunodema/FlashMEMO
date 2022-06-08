export type SortType = 'none' | 'ascending' | 'descending'; // 0 = None, 1 = Ascending, 2 = Descending (need to rework this both on front and back-end)

export interface IServiceSearchParams {
  pageSize: Number;
  pageNumber: Number;
  sortType?: SortType;
  columnToSort?: string;
}
