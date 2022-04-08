import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  protected testServiceURL: string = `${environment.backendRootAddress}/api/v1/User/list`;

  constructor(private http: HttpClient) {}
}
