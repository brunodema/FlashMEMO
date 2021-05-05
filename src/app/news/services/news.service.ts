import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { News } from '../models/news.model';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/internal/operators/tap';

const sortAscending = function (data: News[]) {
  data.sort((a: News, b: News) => a.creationDate - b.creationDate);
};

const sortDescending = function (data: News[]) {
  data.sort((a: News, b: News) => b.creationDate - a.creationDate);
};

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  protected testServiceURL: string =
    environment.production === false
      ? `${environment.backendRootAddress}/News`
      : `${environment.backendRootAddress}/api/v1/News/list`;

  constructor(private http: HttpClient) {}

  getNews(newerFirst: boolean = true): Observable<News[]> {
    //return this.http.get<News[]>(`${this.testServiceURL}/api/v1/News/list`);
    let func = function (data: News[]) {};
    newerFirst === true ? (func = sortAscending) : (func = sortDescending);
    return this.http.get<News[]>(`${this.testServiceURL}`).pipe(tap(func));
  }
}
