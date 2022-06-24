import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { RepositoryServiceConfig } from 'src/app/app.module';
import {
  IBaseAPIResponse,
  IDataResponse,
  IPaginatedListResponse,
} from 'src/app/shared/models/http/http-response-types';
import {
  IServiceSearchParams,
  SortType,
} from 'src/app/shared/models/other/api-query-types';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { GenericRepositoryService } from 'src/app/shared/services/general-repository.service';

import userJson from 'src/assets/test_assets/User.json';
import { User } from '../models/user.model';

class UserSearchParams implements IServiceSearchParams {
  pageSize: Number;
  pageNumber: Number;
  sortType?: SortType;
  columnToSort?: string;
  email?: string;
  username?: string;
}

export abstract class GenericUserService extends GenericRepositoryService<User> {
  constructor(
    protected config: RepositoryServiceConfig,
    protected httpClient: HttpClient,
    @Inject('GenericAuthService') protected authService: GenericAuthService
  ) {
    super(
      `${config.backendAddress}/api/v1/User`,
      config.maxPageSize,
      httpClient,
      authService
    );
  }
  abstract search(searchParams: UserSearchParams): Observable<User[]>;
}

@Injectable()
export class MockUserService extends GenericUserService {
  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG') config: RepositoryServiceConfig,
    protected httpClient: HttpClient,
    @Inject('GenericAuthService') protected authService: GenericAuthService
  ) {
    super(
      {
        backendAddress: config.backendAddress,
        maxPageSize: config.maxPageSize,
      },
      httpClient,
      authService
    );
  }
  getTypename(): string {
    return 'user';
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
      data: userJson.filter((user) => user.id === id)[0] as User,
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
  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG') config: RepositoryServiceConfig,
    protected httpClient: HttpClient,
    @Inject('GenericAuthService') protected authService: GenericAuthService
  ) {
    super(
      `${config.backendAddress}/api/v1/User`,
      config.maxPageSize,
      httpClient,
      authService
    );
  }

  getTypename(): string {
    return 'user';
  }

  search(params: UserSearchParams): Observable<User[]> {
    let formattedURL: string = `${this.repositoryServiceEndpoint}/search?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`;
    if (params.email) {
      formattedURL += `&Email=${params.email}`;
    }
    if (params.username) {
      formattedURL += `&Username=${params.username}`;
    }

    return this.httpClient
      .get<IPaginatedListResponse<User>>(formattedURL)
      .pipe(map((a) => a.data.results));
  }
}
