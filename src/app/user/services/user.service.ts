import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  protected testServiceURL: string = environment.backendRootAddress;

  constructor(private http: HttpClient) {}

  getNews(): Observable<User[]> {
    return this.http.get<User[]>(`${this.testServiceURL}/User`);
  }
}
