import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IServiceSearchParams } from 'src/app/shared/models/other/api-query-types';
import { GeneralRepositoryService } from 'src/app/shared/services/data-table-service';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService extends GeneralRepositoryService<User> {
  constructor(private http: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/User`, http);
  }

  search(searchParams: IServiceSearchParams): Observable<User[]> {
    throw new Error('Method not implemented.');
  }
}
