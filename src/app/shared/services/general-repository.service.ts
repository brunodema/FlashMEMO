// To be honest, I'm not even sure what this does at the moment. I'll leave it here for safety reasons

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IBaseAPIResponse,
  IDataResponse,
  IPaginatedListResponse,
} from '../models/http/http-response-types';
import { GenericAuthService } from './auth.service';

export abstract class GenericRepositoryService<Type> {
  constructor(
    protected repositoryServiceEndpoint: string,
    protected maxPageSize: number,
    protected httpClient: HttpClient,
    @Inject('GenericAuthService') protected authService: GenericAuthService
  ) {}

  abstract getTypename(): string;

  create(object: Type): Observable<IDataResponse<string>> {
    return this.httpClient.post<IDataResponse<string>>(
      `${this.repositoryServiceEndpoint}/create`,
      JSON.stringify(object),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${this.authService.accessToken}`,
        },
      }
    );
  }

  get(id: string): Observable<IDataResponse<Type>> {
    return this.httpClient.get<IDataResponse<Type>>(
      `${this.repositoryServiceEndpoint}/${id}`,
      {
        headers: {
          Authorization: `bearer ${this.authService.accessToken}`,
        },
      }
    );
  }

  update(id: string, object: Type): Observable<IDataResponse<string>> {
    return this.httpClient.put<IDataResponse<string>>(
      `${this.repositoryServiceEndpoint}/${id}`,
      JSON.stringify(object),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${this.authService.accessToken}`,
        },
      }
    );
  }

  delete(id: string): Observable<IBaseAPIResponse> {
    return this.httpClient.post<IDataResponse<IBaseAPIResponse>>(
      `${this.repositoryServiceEndpoint}/delete`,
      JSON.stringify(id),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${this.authService.accessToken}`,
        },
      }
    );
  }

  getAll(): Observable<Type[]> {
    return this.httpClient
      .get<IPaginatedListResponse<Type>>(
        `${this.repositoryServiceEndpoint}/list?pageSize=${this.maxPageSize}`,
        {
          headers: {
            Authorization: `bearer ${this.authService.accessToken}`,
          },
        }
      )
      .pipe(map((a) => a.data.results));
  }

  getById(id: string): Observable<Type> {
    return this.httpClient
      .get<IDataResponse<Type>>(`${this.repositoryServiceEndpoint}/${id}`, {
        headers: {
          Authorization: `bearer ${this.authService.accessToken}`,
        },
      })
      .pipe(map((a) => a.data));
  }
}
