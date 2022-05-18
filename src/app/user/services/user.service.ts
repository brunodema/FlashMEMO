import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import {
  IBaseAPIResponse,
  IDataResponse,
  IPaginatedListResponse,
} from 'src/app/shared/models/http/http-response-types';
import {
  IServiceSearchParams,
  SortColumn,
  SortType,
} from 'src/app/shared/models/other/api-query-types';
import { GenericRepositoryService } from 'src/app/shared/services/general-repository.service';
import { environment } from 'src/environments/environment';

import userJson from 'src/assets/test_assets/User.json';
import { User } from '../models/user.model';

class UserSearchParams implements IServiceSearchParams {
  pageSize: Number;
  pageNumber: Number;
  sortType?: SortType;
  columnToSort?: SortColumn;
  email?: string;
  username?: string;
}

export abstract class GenericUserService extends GenericRepositoryService<User> {
  constructor(protected httpClient: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/user`, httpClient);
  }
  abstract search(searchParams: UserSearchParams): Observable<User[]>;
}

@Injectable()
export class MockUserService extends GenericUserService {
  constructor(private http: HttpClient) {
    super(http);
  }
  search(
    params: UserSearchParams = { pageSize: 10, pageNumber: 1 }
  ): Observable<User[]> {
    return of(userJson);
  }

  getAll(): Observable<User[]> {
    return of(userJson);
  }

  getById(id: string): Observable<User> {
    return of(userJson.filter((x) => x.id == id)[0]);
  }

  create(object: User): Observable<IDataResponse<string>> {
    return of({
      status: '200',
      message: 'Dummy User has been created.',
      errors: [],
      data: '',
    });
  }

  get(id: string): Observable<IDataResponse<User>> {
    return of({
      status: '200',
      message: 'Dummy User object retrieved.',
      errors: [],
      data: {} as User,
    });
  }

  update(id: string, object: User): Observable<IDataResponse<string>> {
    return of({
      status: '200',
      message: 'Dummy User has been updated.',
      errors: [],
      data: '',
    });
  }

  delete(id: string): Observable<IBaseAPIResponse> {
    return of({
      status: '200',
      message: 'Dummy User has been deleted.',
      errors: [],
    });
  }
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
