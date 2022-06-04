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

// Declaring this as an abstract class per recomendation of other Angular users, since interfaces can't be used for 'providers: [{ provide: NonInterfaceClass, useClass: ActualImplementationClass }]' declarations

export abstract class GenericRepositoryService<Type> {
  constructor(
    protected config: RepositoryServiceConfig,
    protected httpClient: HttpClient
  ) {}

  abstract getTypename(): string;

  create(object: Type): Observable<IDataResponse<string>> {
    return this.httpClient.post<IDataResponse<string>>(
      `${this.config.backendAddress}/create`,
      JSON.stringify(object),
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }

  get(id: string): Observable<IDataResponse<Type>> {
    return this.httpClient.get<IDataResponse<Type>>(
      `${this.config.backendAddress}/${id}`
    );
  }

  update(id: string, object: Type): Observable<IDataResponse<string>> {
    return this.httpClient.put<IDataResponse<string>>(
      `${this.config.backendAddress}/${id}`,
      JSON.stringify(object),
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }

  delete(id: string): Observable<IBaseAPIResponse> {
    return this.httpClient.post<IDataResponse<IBaseAPIResponse>>(
      `${this.config.backendAddress}/delete`,
      JSON.stringify(id),
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }

  getAll(): Observable<Type[]> {
    return this.httpClient
      .get<IPaginatedListResponse<Type>>(
        `${this.config.backendAddress}/list?pageSize=${this.config.maxPageSize}`
      )
      .pipe(map((a) => a.data.results));
  }

  getById(id: string): Observable<Type> {
    return this.httpClient
      .get<IDataResponse<Type>>(`${this.config.backendAddress}/${id}`)
      .pipe(map((a) => a.data));
  }
}
