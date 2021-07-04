import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { environment } from 'src/environments/environment';

import { map } from 'rxjs/internal/operators/map';
import { SortType } from 'src/app/shared/models/sort-classes/sort-type';
import { PaginatedListResponse } from 'src/app/shared/models/api-response';
import { SortOptions } from 'src/app/shared/models/sort-classes/sort-options';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  protected testServiceURL: string = `${environment.backendRootAddress}/api/v1/News/list`;

  constructor(private http: HttpClient) {}

  getAllNews(sortType: SortType = SortType.NONE): Observable<News[]> {
    let pageSize = environment.maxPageSize;
    let comparisonFunction = SortOptions.getComparisonFunction(sortType);

    return this.http
      .get<PaginatedListResponse<News>>(
        `${this.testServiceURL}?pageSize=${pageSize}`
      )
      .pipe(map((a) => a.data.results.sort(comparisonFunction)));
  }
}
