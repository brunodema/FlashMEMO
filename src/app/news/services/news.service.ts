import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  protected testServiceURL: string = environment.backendRootAddress;

  constructor(private http: HttpClient) {}

  getNews(): Observable<News[]> {
    //return this.http.get<News[]>(`${this.testServiceURL}/api/v1/News/list`);
    return this.http.get<News[]>(`http://localhost:3000/News`);
  }
}
