import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface LoginRequestModel {
  email: string;
  password: string;
}

export interface LoginResponseModel {
  status: string;
  message: string;
  jwtToken: string;
  errors: any[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected serviceURL: string = `${environment.backendRootAddress}/api/v1/Auth`;

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient) {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token')!; // non-null assertion operator
    return !this.jwtHelper.isTokenExpired(token);
  }

  public login(
    email: string,
    password: string
  ): Observable<LoginResponseModel> {
    const body: LoginRequestModel = {
      email: email,
      password: password,
    };
    const customHeaders = { 'content-type': 'application/json' };
    return this.http
      .post<LoginResponseModel>(`${this.serviceURL}/login`, body)
      .pipe(
        map((res) => {
          this.storeJWT(res.jwtToken);
          return res;
        }),
        catchError((err: HttpErrorResponse) => throwError(err))
      );
  }

  public storeJWT(JWTToken: string) {
    this.clearPreExistingJWT();
    localStorage.setItem('token', JWTToken);
  }

  public getJWT() {
    this.jwtHelper.tokenGetter();
  }

  private clearPreExistingJWT() {
    localStorage.removeItem('token');
  }
}
