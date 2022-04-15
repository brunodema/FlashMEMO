import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  ILoginRequest,
  IRegisterRequest,
} from '../models/http/http-request-types';
import {
  IBaseAPIResponse,
  ILoginResponse,
} from '../models/http/http-response-types';

export abstract class IAuthService {
  protected homeAddress = '/home';

  constructor(
    protected jwtHelper: JwtHelperService,
    protected router: Router,
    protected toastr: ToastrService
  ) {}

  abstract login(requestData: ILoginRequest): Observable<any>;
  abstract register(registerData: IRegisterRequest): Observable<any>;

  public getUserName(): string {
    return this.jwtHelper.decodeToken(this.getJWT())['username'];
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token')!; // non-null assertion operator
    return !this.jwtHelper.isTokenExpired(token);
  }

  public logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.redirectToHome();
  }

  protected storeJWT(JWTToken: string) {
    this.clearPreExistingJWT();
    localStorage.setItem('token', JWTToken);
  }

  protected getJWT(): string {
    return this.jwtHelper.tokenGetter();
  }

  protected clearPreExistingJWT() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  protected handleSuccessfulLogin(res: ILoginResponse) {
    this.storeJWT(res.jwtToken);
    this.toastr
      .success('You will soon be redirected.', 'Welcome to FlashMEMO!', {
        timeOut: 3000,
      })
      .onHidden.subscribe(() => this.redirectToHome());
  }

  protected handleSuccessfulRegistration(res: IBaseAPIResponse) {
    this.toastr.success(
      'User created. You will soon be redirected.',
      'Registration Complete!',
      {
        timeOut: 3000,
      }
    );
  }

  protected handleFailedLogin(err: HttpErrorResponse) {
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

  protected processErrorsFromAPI(errorResponse: ILoginResponse): string {
    let resp = errorResponse.message + '\n\n';
    if (errorResponse.errors) {
      errorResponse.errors.forEach((error) => {
        resp += `\n${error}`;
      });
    }
    return resp;
  }

  protected redirectToHome() {
    this.router.navigate([this.homeAddress]);
  }
}

export class MockAuthService extends IAuthService {
  constructor(
    protected jwtHelper: JwtHelperService,
    protected router: Router,
    protected toastr: ToastrService
  ) {
    super(jwtHelper, router, toastr);
  }

  login(requestData: ILoginRequest): Observable<any> {
    return of(
      this.handleSuccessfulLogin({
        jwtToken: this.jwtHelper.tokenGetter(),
        status: '200',
        errors: [],
        message: 'success',
      })
    );
  }

  register(registerData: IRegisterRequest): Observable<any> {
    return of(
      () =>
        this.handleSuccessfulRegistration({
          errors: [],
          message: 'Success',
          status: '200',
        }),
      this.login({
        email: registerData.email,
        password: registerData.password,
      })
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends IAuthService {
  protected serviceURL: string = `${environment.backendRootAddress}/api/v1/Auth`;
  protected customHeaders = { 'content-type': 'application/json' }; // check the need for it (and start using if necessary)
  protected homeAddress = '/home';

  constructor(
    protected jwtHelper: JwtHelperService,
    protected http: HttpClient,
    protected router: Router,
    protected toastr: ToastrService
  ) {
    super(jwtHelper, router, toastr);
  }

  public login(requestData: ILoginRequest): Observable<any> {
    return this.http
      .post<ILoginResponse>(`${this.serviceURL}/login`, requestData)
      .pipe(
        map((res) => this.handleSuccessfulLogin(res)),
        catchError((err: HttpErrorResponse) => this.handleFailedLogin(err))
      );
  }

  public register(registerData: IRegisterRequest): Observable<any> {
    return this.http
      .post<IBaseAPIResponse>(`${this.serviceURL}/register`, registerData)
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
}
