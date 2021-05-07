import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { News } from '../models/news.model';
import { environment } from 'src/environments/environment';

import { map } from 'rxjs/internal/operators/map';
import { NewsListResponseModel } from './news.response.model';

const sortAscending = (a: News, b: News) => a.creationDate - b.creationDate;

const sortDescending = (a: News, b: News) => b.creationDate - a.creationDate;

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  protected testServiceURL: string = `${environment.backendRootAddress}/api/v1/News/list`;

  constructor(private http: HttpClient) {}

  getNews(newerFirst: boolean = true): Observable<News[]> {
    //return this.http.get<News[]>(`${this.testServiceURL}/api/v1/News/list`);
    let func: any;
    newerFirst === true ? (func = sortAscending) : (func = sortDescending);
    //return this.http.get<News[]>(`${this.testServiceURL}`).pipe(tap(func));
    return this.http
      .get<NewsListResponseModel>(`${this.testServiceURL}`)
      .pipe(map((a) => a.news.sort(func)));
  }
}
