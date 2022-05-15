import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
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
import { GenericNotificationService } from './notification/notification.service';

export abstract class GenericAuthService {
  protected homeAddress = '/home';

  constructor(
    protected jwtHelper: JwtHelperService,
    protected router: Router,
    protected notificationService: GenericNotificationService
  ) {}

  // TIL about Subject/BehaviorSubject. "A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners" (source: https://rxjs.dev/guide/subject). Implementation taken from here: https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243

  public loggedUsername = new BehaviorSubject<string>(
    this.decodePropertyFromToken('username') ?? ''
  );
  public loggedUserId = new BehaviorSubject<string>(
    this.decodePropertyFromToken('sub') ?? ''
  );

  abstract login(requestData: ILoginRequest): Observable<any>;
  abstract register(registerData: IRegisterRequest): Observable<any>;

  public decodePropertyFromToken(property: string): string {
    if (!this.getJWT()) return '';
    return this.jwtHelper.decodeToken(this.getJWT())[property];
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token')!; // non-null assertion operator
    return !this.jwtHelper.isTokenExpired(token);
  }

  public logout() {
    this.clearPreExistingJWT();
    this.loggedUsername.next('?');
    this.redirectToHome();
  }

  protected storeJWT(JWTToken: string) {
    this.clearPreExistingJWT();
    localStorage.setItem('token', JWTToken);
  }

  protected getJWT(): string {
    const token = this.jwtHelper.tokenGetter();

    if (this.jwtHelper.isTokenExpired(token)) {
      // console.log('token is expired. Clearing it...');
      this.clearPreExistingJWT();
      return '';
    }

    // console.log('Returning valid token...');
    return token;
  }

  protected clearPreExistingJWT() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  protected handleSuccessfulLogin(res: ILoginResponse) {
    this.storeJWT(res.jwtToken);
    this.loggedUsername.next(this.decodePropertyFromToken('username'));
    this.loggedUserId.next(this.decodePropertyFromToken('sub'));
    this.notificationService
      .showSuccess('You will soon be redirected.', 'Welcome to FlashMEMO!')
      .onHidden.subscribe(() => this.redirectToHome());
  }

  protected handleSuccessfulRegistration(res: IBaseAPIResponse) {
    this.notificationService.showSuccess(
      'User created. You will soon be redirected.',
      'Registration Complete'
    );
  }

  protected handleFailedLogin(err: HttpErrorResponse) {
    this.clearPreExistingJWT();
    this.notificationService.showError(
      this.processErrorsFromAPI(err.error),
      'Authentication Failure'
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

@Injectable()
export class MockAuthService extends GenericAuthService {
  constructor(
    protected jwtHelper: JwtHelperService,
    protected router: Router,
    protected notificationService: GenericNotificationService
  ) {
    super(jwtHelper, router, notificationService);
  }

  login(requestData: ILoginRequest): Observable<any> {
    return of(
      this.handleSuccessfulLogin({
        jwtToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.p5Csu2THYW5zJys2CWdbGM8GaWjpY6lOQpdLoP4D7V4',
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
export class AuthService extends GenericAuthService {
  protected serviceURL: string = `${environment.backendRootAddress}/api/v1/Auth`;
  protected customHeaders = { 'content-type': 'application/json' }; // check the need for it (and start using if necessary)
  protected homeAddress = '/home';

  constructor(
    protected jwtHelper: JwtHelperService,
    protected http: HttpClient,
    protected router: Router,
    protected notificationService: GenericNotificationService
  ) {
    super(jwtHelper, router, notificationService);
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
