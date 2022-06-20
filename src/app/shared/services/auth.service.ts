import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Guid } from 'guid-ts';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RepositoryServiceConfig } from 'src/app/app.module';
import { User } from 'src/app/user/models/user.model';
import {
  ILoginRequest,
  IRegisterRequest,
} from '../models/http/http-request-types';
import {
  IBaseAPIResponse,
  ILoginResponse,
} from '../models/http/http-response-types';
import { GenericNotificationService } from './notification/notification.service';
import { SpinnerType } from './UI/spinner.service';

export abstract class GenericAuthService {
  protected homeAddress = '/home';

  constructor(
    protected jwtHelper: JwtHelperService,
    protected router: Router,
    protected notificationService: GenericNotificationService,
    protected spinnerService: NgxSpinnerService,
    protected cookieService: CookieService,
    @Inject('COOKIE_CONFIG') protected cookieSettings: { useValue: boolean }
  ) {}

  get accessToken(): string {
    const token = this.jwtHelper.tokenGetter();

    if (this.jwtHelper.isTokenExpired(token)) {
      // console.log('token is expired. Clearing it...');
      this.clearPreExistingTokens();
      return '';
    }

    // console.log('Returning valid token...');
    return token;
  }

  get refreshToken(): string {
    return this.cookieService.get('refreshToken');
  }

  private decodeUserFromAccessToken(): User {
    if (this.accessToken) {
      return new User({
        id:
          this.decodePropertyFromToken(this.accessToken, 'sub') ??
          Guid.newGuid(),
        email:
          this.decodePropertyFromToken(this.accessToken, 'email') ??
          'johndoe@flashmemo.edu',
        name: this.decodePropertyFromToken(this.accessToken, 'name') ?? 'John',
        surname:
          this.decodePropertyFromToken(this.accessToken, 'surname') ?? 'Doe',
        username:
          this.decodePropertyFromToken(this.accessToken, 'username') ??
          'johndoe',
      });
    }
    return new User();
  }

  // TIL about Subject/BehaviorSubject. "A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners" (source: https://rxjs.dev/guide/subject). Implementation taken from here: https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243
  public loggedUser = new BehaviorSubject<User>(
    this.decodeUserFromAccessToken()
  );

  isLoggedUserAdmin(): boolean {
    // console.log('checking if user is admin...', this.checkIfAdmin());
    return this.checkIfAdmin();
  }

  /** Triggers one of the global spinners depending on the auth action taken by the user (login or logout). */
  protected showAuthSpinner(spinnerType: SpinnerType) {
    this.spinnerService.show(spinnerType);
    setTimeout(() => {
      this.spinnerService.hide(spinnerType).then(() => {
        this.redirectToHome();
      });
    }, 5000);
  }

  public decodePropertyFromToken(token: string, property: string): string {
    return this.jwtHelper.decodeToken(token)[property];
  }

  public logout() {
    this.clearPreExistingTokens();
    this.loggedUser.next(new User());
    this.showAuthSpinner(SpinnerType.LOGOUT);
  }

  protected storeToken(JWTToken: string, rememberMe: boolean) {
    this.clearPreExistingTokens();
    // console.log('storing jwt', rememberMe);
    rememberMe
      ? localStorage.setItem('token', JWTToken)
      : sessionStorage.setItem('token', JWTToken);
  }

  protected clearPreExistingTokens() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  /**
   * Checks if the logged user (verifies stored JWT) has an admin claim in his/hers credentials.
   * @returns
   */
  protected checkIfAdmin(): boolean {
    if (this.accessToken) {
      return (
        this.decodePropertyFromToken(
          this.accessToken,
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ) === 'admin'
      );
    }
    return false;
  }

  public isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired(this.accessToken);
  }

  protected handleSuccessfulLogin(res: ILoginResponse, rememberMe: boolean) {
    this.storeToken(res.accessToken, rememberMe);
    this.loggedUser.next(this.decodeUserFromAccessToken());
    this.showAuthSpinner(SpinnerType.LOGIN);
  }

  protected handleSuccessfulRegistration(res: IBaseAPIResponse) {
    // leave this empty JUST IN CASE I need to add logic here in the future. This used to show the success notification, but I'm moving this out of service logic.
  }

  protected handleFailedLogin(err: HttpErrorResponse) {
    this.clearPreExistingTokens();
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

  abstract login(
    requestData: ILoginRequest,
    rememberMe: boolean
  ): Observable<any>;

  abstract register(registerData: IRegisterRequest): Observable<any>;
}

@Injectable({
  providedIn: 'root',
})
export class MockAuthService extends GenericAuthService {
  constructor(
    protected jwtHelper: JwtHelperService,
    protected router: Router,
    protected notificationService: GenericNotificationService,
    protected spinnerService: NgxSpinnerService,
    protected cookieService: CookieService,
    @Inject('COOKIE_CONFIG') protected cookieSettings: { useValue: boolean }
  ) {
    super(
      jwtHelper,
      router,
      notificationService,
      spinnerService,
      cookieService,
      cookieSettings
    );
  }

  login(requestData: ILoginRequest, rememberMe: boolean): Observable<any> {
    return of(
      this.handleSuccessfulLogin(
        {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZmxhc2htZW1vLmVkdSIsImp0aSI6ImRjYWZiMTEzLTc3OTQtNDlkYi04Y2RlLTQyYjdmMTg3NWZkMyIsInN1YiI6IjEyMzQ1Njc4OTAiLCJ1c2VybmFtZSI6IkpvaG4gRG9lIiwibmFtZSI6IkpvaG4iLCJzdXJuYW1lIjoiRG9lIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiYWRtaW4iLCJleHAiOjk5OTk5OTk5OTl9.RjQl-_1AMm1qekxdItV8pBndguQtHiPXs8DXNgy-XZc',
          refreshToken: '',
          errors: [],
          message: 'success',
        },
        rememberMe
      )
    );
  }

  register(registerData: IRegisterRequest): Observable<any> {
    return of(
      // this.handleSuccessfulRegistration({
      //   errors: [],
      //   message: 'Success',
      //   status: '200',
      // }),
      this.login(
        {
          username: registerData.username,
          password: registerData.password,
        },
        false
      ).subscribe()
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends GenericAuthService {
  protected authServiceURL: string = `${this.config.backendAddress}/api/v1/Auth`;
  protected userServiceURL: string = `${this.config.backendAddress}/api/v1/User`;
  protected customHeaders = { 'content-type': 'application/json' }; // check the need for it (and start using if necessary)
  protected homeAddress = '/home';

  constructor(
    @Inject('REPOSITORY_SERVICE_CONFIG')
    protected config: RepositoryServiceConfig,
    protected jwtHelper: JwtHelperService,
    protected http: HttpClient,
    protected router: Router,
    protected notificationService: GenericNotificationService,
    protected spinnerService: NgxSpinnerService,
    protected cookieService: CookieService,
    @Inject('COOKIE_CONFIG') protected cookieSettings: { useValue: boolean }
  ) {
    super(
      jwtHelper,
      router,
      notificationService,
      spinnerService,
      cookieService,
      cookieSettings
    );
  }

  public login(
    requestData: ILoginRequest,
    rememberMe: boolean
  ): Observable<any> {
    return this.http
      .post<ILoginResponse>(`${this.authServiceURL}/login`, requestData)
      .pipe(
        map((res) => this.handleSuccessfulLogin(res, rememberMe)),
        catchError((err: HttpErrorResponse) => this.handleFailedLogin(err))
      );
  }

  public register(registerData: IRegisterRequest): Observable<any> {
    return this.http
      .post<IBaseAPIResponse>(`${this.userServiceURL}/create`, registerData)
      .pipe(
        map((res) => {
          this.handleSuccessfulRegistration(res);
          this.login(
            {
              username: registerData.username,
              password: registerData.password,
            },
            false
          ).subscribe();
        }),
        catchError((err: HttpErrorResponse) => this.handleFailedLogin(err))
      );
  }
}
