import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { environment } from 'src/environments/environment';

import { map } from 'rxjs/operators';

import {
  IServiceSearchParams,
  SortColumn,
  SortType,
} from 'src/app/shared/models/other/api-query-types';
import { IPaginatedListResponse } from 'src/app/shared/models/http/http-response-types';
import { GeneralRepositoryService } from 'src/app/shared/services/general-repository-service';

class NewsSearchParams implements IServiceSearchParams {
  pageSize: Number;
  pageNumber: Number;
  fromDate?: string;
  toDate?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  sortType?: SortType;
  columnToSort?: SortColumn;
}

@Injectable({
  providedIn: 'root',
})
export class NewsService extends GeneralRepositoryService<News> {
  constructor(private http: HttpClient) {
    super(`${environment.backendRootAddress}/api/v1/News`, http);
  }

  search(
    params: NewsSearchParams = { pageSize: 10, pageNumber: 1 }
  ): Observable<News[]> {
    let formattedURL: string = `${this.endpointURL}/search?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`;
    if (params.fromDate) {
      formattedURL += `&FromDate=${params.fromDate}`;
    }
    if (params.toDate) {
      formattedURL += `&ToDate=${params.toDate}`;
    }
    if (params.title) {
      formattedURL += `&Title=${params.title}`;
    }
    if (params.subtitle) {
      formattedURL += `&Subtitle=${params.subtitle}`;
    }
    if (params.content) {
      formattedURL += `&Content=${params.content}`;
    }
    if (params.sortType) {
      formattedURL += `&SortType=${params.sortType}`;
    }
    if (params.columnToSort) {
      formattedURL += `&ColumnToSort=${params.columnToSort}`;
    }

    return this.http
      .get<IPaginatedListResponse<News>>(formattedURL)
      .pipe(map((a) => a.data.results));
  }
}
