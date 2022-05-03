// To be honest, I'm not even sure what this does at the moment. I'll leave it here for safety reasons

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  IBaseAPIResponse,
  IDataAPIResponse,
  IPaginatedListResponse,
} from '../models/http/http-response-types';

// Declaring this as an abstract class per recomendation of other Angular users, since interfaces can't be used for 'providers: [{ provide: NonInterfaceClass, useClass: ActualImplementationClass }]' declarations

@Injectable()
export abstract class GenericRepositoryService<Type> {
  constructor(
    protected endpointURL: String,
    protected httpClient: HttpClient
  ) {}

  create(object: Type): Observable<IDataAPIResponse<string>> {
    return this.httpClient.post<IDataAPIResponse<string>>(
      `${this.endpointURL}/create`,
      JSON.stringify(object)
    );
  }

  get(id: string): Observable<IDataAPIResponse<Type>> {
    return this.httpClient.get<IDataAPIResponse<Type>>(
      `${this.endpointURL}/${id}`
    );
  }

  update(id: string, object: Type): Observable<IDataAPIResponse<string>> {
    return this.httpClient.put<IDataAPIResponse<string>>(
      `${this.endpointURL}/${id}`,
      JSON.stringify(object)
    );
  }

  delete(id: string): Observable<IBaseAPIResponse> {
    return this.httpClient.post<IDataAPIResponse<IBaseAPIResponse>>(
      `${this.endpointURL}/delete`,
      id
    );
  }

  getAll(): Observable<Type[]> {
    return this.httpClient
      .get<IPaginatedListResponse<Type>>(
        `${this.endpointURL}/list?pageSize=${environment.maxPageSize}`
      )
      .pipe(map((a) => a.data.results));
  }

  getById(id: string): Observable<Type> {
    return this.httpClient
      .get<IDataAPIResponse<Type>>(`${this.endpointURL}/${id}`)
      .pipe(map((a) => a.data));
  }
}
