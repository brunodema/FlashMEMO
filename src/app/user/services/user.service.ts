import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedListResponse } from 'src/app/shared/models/api-response';
import { SortOptions } from 'src/app/shared/models/sort-classes/sort-options';
import { SortType } from 'src/app/shared/models/sort-classes/sort-type';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  protected testServiceURL: string = `${environment.backendRootAddress}/api/v1/User/list`;

  constructor(private http: HttpClient) {}

  getAllUsers(sortType: SortType = SortType.NONE): Observable<User[]> {
    let pageSize = environment.maxPageSize;
    let comparisonFunction = SortOptions.getComparisonFunction(sortType);

    return this.http
      .get<PaginatedListResponse<User>>(
        `${this.testServiceURL}?pageSize=${pageSize}`
      )
      .pipe(map((a) => a.data.results));
  }
}
