import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IPaginatedListResponse } from 'src/app/shared/models/http/http-response-types';
import {
  IServiceSearchParams,
  SortColumn,
  SortType,
} from 'src/app/shared/models/other/api-query-types';
import { GenericRepositoryService } from 'src/app/shared/services/general-repository-service';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

class UserSearchParams implements IServiceSearchParams {
  pageSize: Number;
  pageNumber: Number;
  sortType?: SortType;
  columnToSort?: SortColumn;
  email: string;
  username: string;
}

export abstract class GenericUserService extends GenericRepositoryService<User> {
  constructor(protected httpClient: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/user`, httpClient);
  }
  abstract search(searchParams: UserSearchParams): Observable<User[]>;
}

@Injectable()
export class UserService extends GenericRepositoryService<User> {
  constructor(private http: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/User`, http);
  }

  search(params: UserSearchParams): Observable<User[]> {
    let formattedURL: string = `${this.endpointURL}/search?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`;
    if (params.email) {
      formattedURL += `&Email=${params.email}`;
    }
    if (params.username) {
      formattedURL += `&Username=${params.username}`;
    }

    return this.http
      .get<IPaginatedListResponse<User>>(formattedURL)
      .pipe(map((a) => a.data.results));
  }
}
