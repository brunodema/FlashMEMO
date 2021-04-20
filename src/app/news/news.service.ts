import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  protected testServiceURL : string = "http://localhost:3000/";

  constructor(private http : HttpClient) { }

  getNews() : Observable<News[]>
  {
    return this.http.get<News[]>(`${this.testServiceURL}/News`);
  }
}
