import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
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
  protected homeAddress = '/home';

  constructor(
    private jwtHelper: JwtHelperService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token')!; // non-null assertion operator
    return !this.jwtHelper.isTokenExpired(token);
  }

  public login(requestData: LoginRequestModel): Observable<any> {
    return this.http
      .post<LoginResponseModel>(`${this.serviceURL}/login`, requestData)
      .pipe(
        map((res) => this.handleSuccessfulLogin(res)),
        catchError((err: HttpErrorResponse) => this.handleFailedLogin(err))
      );
  }

  public logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.redirectToHome();
  }

  public register(registerData: RegisterRequestModel): Observable<any> {
    return this.http
      .post<BaseAPIResponseModel>(`${this.serviceURL}/register`, registerData)
      .pipe(
        map((res) => {
          this.handleSuccessfulRegistration(res);
          this.login({
            email: registerData.email,
            password: registerData.password,
          }).subscribe();
        }),
        catchError((err: HttpErrorResponse) => this.handleFailedLogin(err))
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
    sessionStorage.removeItem('token');
  }

  private handleSuccessfulLogin(res: LoginResponseModel) {
    this.storeJWT(res.jwtToken);
    this.toastr
      .success('You will soon be redirected.', 'Welcome to FlashMEMO!', {
        timeOut: 3000,
      })
      .onHidden.subscribe(() => this.redirectToHome());
  }

  private handleSuccessfulRegistration(res: BaseAPIResponseModel) {
    this.toastr.success(
      'User created. You will soon be redirected.',
      'Registration Complete!',
      {
        timeOut: 3000,
      }
    );
  }

  private handleFailedLogin(err: HttpErrorResponse) {
    this.clearPreExistingJWT();
    this.toastr.error(
      this.processErrorsFromAPI(err.error),
      'Authentication Failure',
      {
        timeOut: 3000,
      }
    );
    return throwError(err);
  }

  processErrorsFromAPI(errorResponse: LoginResponseModel): string {
    let resp = errorResponse.message + '\n\n';
    if (errorResponse.errors) {
      errorResponse.errors.forEach((error) => {
        resp += `\n${error}`;
      });
    }
    return resp;
  }

  redirectToHome() {
    this.router.navigate([this.homeAddress]);
  }
}
