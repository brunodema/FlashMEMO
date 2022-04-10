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

/**
 * Similar to the common implementaiton, but Uses string properties to hold values, in case they are too large in terms of bits.
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

/**
 * I have to implement this class so I can declare objects of this type when using implementation outside Angular's libraries.
 */
export class LargePaginatedList<Type> implements ILargePaginatedList<Type> {
  results: Type[];
  pageIndex: string;
  totalPages: string;
  resultSize: string; // different naming than the other class, VERY DANGEROUS
  totalAmount: string; // different naming than the other class, VERY DANGEROUS
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IPaginatedListResponse<Type> {
  errors: string[];
  message: string;
  data: IPaginatedList<Type> | ILargePaginatedList<Type>; // property name must match with the returned object (lesson learned)
  status: string;
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
