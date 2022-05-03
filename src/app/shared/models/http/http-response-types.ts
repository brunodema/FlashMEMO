export interface IBaseAPIResponse {
  status: string;
  message: string;
  errors: any[];
}

export interface ILoginResponse extends IBaseAPIResponse {
  jwtToken: string;
}

/**
 * New interface used to represent responses from the back-end that includes the basic metada, plus some data structure of some sort (ex: dictionary API results).
 */
export interface IDataResponse<T> extends IBaseAPIResponse {
  data: T;
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

/**
 * Similar to the common implementaiton, but Uses string properties to hold values, in case they are too large in terms of bits. *Must fix this once Image API is operational (front-end and back-end)*
 */
export interface ILargePaginatedList<Type> {
  results: Type[];
  pageIndex: string;
  totalPages: string;
  resultSize: string; // different naming than the other class, VERY DANGEROUS
  totalAmount: string; // different naming than the other class, VERY DANGEROUS
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IPaginatedListResponse<Type> extends IBaseAPIResponse {
  data: IPaginatedList<Type> | ILargePaginatedList<Type>; // property name must match with the returned object (lesson learned)
}

/**
 * I have to implement this class so I can declare objects of this type when using implementation outside Angular's libraries.
 */
export class PaginatedListResponse<Type>
  implements IPaginatedListResponse<Type>
{
  public constructor(init?: Partial<IPaginatedListResponse<Type>>) {
    Object.assign(this, init);
  }

  errors: string[];
  message: string;
  data: IPaginatedList<Type> | ILargePaginatedList<Type>;
  status: string;
}
