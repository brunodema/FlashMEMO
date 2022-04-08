export interface IBaseAPIResponse {
  status: string;
  message: string;
  errors: any[];
}

export interface ILoginResponse extends IBaseAPIResponse {
  jwtToken: string;
}

export interface IPaginatedList<Type> {
  results: Type[];
  pageIndex: number;
  totalPages: number;
  count: number;
  total: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IPaginatedListResponse<Type> {
  errors: string[];
  message: string;
  data: IPaginatedList<Type>; // name must match with the returned object (lesson learned)
  status: string;
}
