import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface LoginRequestModel {
  Email: string;
  Password: string;
}

export interface LoginResponseModel {
  Status: string;
  Message: string;
  JWTToken: string;
  Errors: any[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected serviceURL: string = `${environment.backendRootAddress}/api/v1/Auth`;

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient) {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token')!; // non-null assertion operator
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  public login(
    email: string,
    password: string
  ): Observable<LoginResponseModel> {
    const body: LoginRequestModel = {
      Email: email,
      Password: password,
    };
    const customHeaders = { 'content-type': 'application/json' };
    return this.http.post<LoginResponseModel>(`${this.serviceURL}/login`, body);
  }
}
