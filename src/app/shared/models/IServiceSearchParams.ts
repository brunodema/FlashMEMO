export type SortColumn = '';
export type SortType = 0 | 1 | 2; // 0 = None, 1 = Ascending, 2 = Descending (need to rework this both on front and back-end)

export interface IServiceSearchParams {
  pageSize: Number;
  pageNumber: Number;
  sortType?: SortType;
  columnToSort?: SortColumn;
}
