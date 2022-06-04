// To be honest, I'm not even sure what this does at the moment. I'll leave it here for safety reasons

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepositoryServiceConfig } from 'src/app/app.module';
import { environment } from 'src/environments/environment';
import {
  IBaseAPIResponse,
  IDataResponse,
  IPaginatedListResponse,
} from '../models/http/http-response-types';

export abstract class GenericRepositoryService<Type> {
  constructor(
    protected repositoryServiceEndpoint: string,
    protected maxPageSize: number,
    protected httpClient: HttpClient
  ) {}

  abstract getTypename(): string;

  create(object: Type): Observable<IDataResponse<string>> {
    return this.httpClient.post<IDataResponse<string>>(
      `${this.repositoryServiceEndpoint}/create`,
      JSON.stringify(object),
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }

  get(id: string): Observable<IDataResponse<Type>> {
    return this.httpClient.get<IDataResponse<Type>>(
      `${this.repositoryServiceEndpoint}/${id}`
    );
  }

  update(id: string, object: Type): Observable<IDataResponse<string>> {
    return this.httpClient.put<IDataResponse<string>>(
      `${this.repositoryServiceEndpoint}/${id}`,
      JSON.stringify(object),
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }

  delete(id: string): Observable<IBaseAPIResponse> {
    return this.httpClient.post<IDataResponse<IBaseAPIResponse>>(
      `${this.repositoryServiceEndpoint}/delete`,
      JSON.stringify(id),
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }

  getAll(): Observable<Type[]> {
    return this.httpClient
      .get<IPaginatedListResponse<Type>>(
        `${this.repositoryServiceEndpoint}/list?pageSize=${this.maxPageSize}`
      )
      .pipe(map((a) => a.data.results));
  }

  getById(id: string): Observable<Type> {
    return this.httpClient
      .get<IDataResponse<Type>>(`${this.repositoryServiceEndpoint}/${id}`)
      .pipe(map((a) => a.data));
  }
}
