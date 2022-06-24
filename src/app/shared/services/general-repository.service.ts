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
  ) {
    this.authHeader = this.authHeader.append(
      'authorization',
      `bearer ${this.authService.accessToken}`
    );
  }

  protected authHeader: HttpHeaders = new HttpHeaders();

  abstract getTypename(): string;

  create(object: Type): Observable<IDataResponse<string>> {
    return this.httpClient.post<IDataResponse<string>>(
      `${this.repositoryServiceEndpoint}/create`,
      JSON.stringify(object),
      { headers: this.authHeader.append('Content-Type', 'application/json') }
    );
  }

  get(id: string): Observable<IDataResponse<Type>> {
    return this.httpClient.get<IDataResponse<Type>>(
      `${this.repositoryServiceEndpoint}/${id}`,
      { headers: this.authHeader }
    );
  }

  update(id: string, object: Type): Observable<IDataResponse<string>> {
    return this.httpClient.put<IDataResponse<string>>(
      `${this.repositoryServiceEndpoint}/${id}`,
      JSON.stringify(object),
      { headers: this.authHeader.append('Content-Type', 'application/json') }
    );
  }

  delete(id: string): Observable<IBaseAPIResponse> {
    return this.httpClient.post<IDataResponse<IBaseAPIResponse>>(
      `${this.repositoryServiceEndpoint}/delete`,
      JSON.stringify(id),
      { headers: this.authHeader.append('Content-Type', 'application/json') }
    );
  }

  getAll(): Observable<Type[]> {
    return this.httpClient
      .get<IPaginatedListResponse<Type>>(
        `${this.repositoryServiceEndpoint}/list?pageSize=${this.maxPageSize}`,
        { headers: this.authHeader }
      )
      .pipe(map((a) => a.data.results));
  }

  getById(id: string): Observable<Type> {
    return this.httpClient
      .get<IDataResponse<Type>>(`${this.repositoryServiceEndpoint}/${id}`, {
        headers: this.authHeader,
      })
      .pipe(map((a) => a.data));
  }
}
