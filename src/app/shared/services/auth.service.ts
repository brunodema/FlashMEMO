import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  BaseAPIResponseModel,
  LoginRequestModel,
  LoginResponseModel,
  RegisterRequestModel,
} from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected serviceURL: string = `${environment.backendRootAddress}/api/v1/Auth`;
  protected customHeaders = { 'content-type': 'application/json' }; // check the need for it (and start using if necessary)

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
    return this.http
      .post<LoginResponseModel>(`${this.serviceURL}/login`, body)
      .pipe(
        map((res) => this.handleSuccessfulLogin(res)),
        catchError((err: HttpErrorResponse) => throwError(err))
      );
  }

  public logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  public register(
    registerData: RegisterRequestModel
  ): Observable<BaseAPIResponseModel> {
    return this.http
      .post<BaseAPIResponseModel>(`${this.serviceURL}/register`, registerData)
      .pipe(
        map((res) => res),
        catchError((err: HttpErrorResponse) => throwError(err))
      );
  }

  private storeJWT(JWTToken: string) {
    this.clearPreExistingJWT();
    localStorage.setItem('token', JWTToken);
  }

  private getJWT() {
    this.jwtHelper.tokenGetter();
  }

  private clearPreExistingJWT() {
    localStorage.removeItem('token');
  }

  private handleSuccessfulLogin(res: LoginResponseModel): LoginResponseModel {
    this.storeJWT(res.jwtToken);
    return res;
  }
}
