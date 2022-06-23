import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
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
    @Inject('COOKIE_CONFIG')
    protected cookieSettings: { useSecure: boolean; expirationPeriod: number }
  ) {}

  get storageMode(): 'PERSISTENT' | 'SESSION' | 'UNAUTHENTICATED' {
    if (sessionStorage.getItem('token')) return 'SESSION'; // I'll make session have precedence here, for extra safety
    if (localStorage.getItem('token')) return 'PERSISTENT';
    return 'UNAUTHENTICATED';
  }

  get accessToken(): string {
    return this.jwtHelper.tokenGetter();
  }

  get refreshToken(): string {
    return this.cookieService.get('RefreshToken');
  }

  private decodeUserFromAccessToken(): User | null {
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
    return null;
  }

  // TIL about Subject/BehaviorSubject. "A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners" (source: https://rxjs.dev/guide/subject). Implementation taken from here: https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243
  public loggedUser = new BehaviorSubject<User | null>(
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
    this.clearPreExistingCookies();

    this.loggedUser.next(null);

    this.showAuthSpinner(SpinnerType.LOGOUT);
  }

  protected storeAccessToken(JWTToken: string, rememberMe: boolean) {
    this.clearPreExistingTokens();

    if (rememberMe) {
      localStorage.setItem('token', JWTToken);
    } else {
      sessionStorage.setItem('token', JWTToken);
    }
  }

  protected setRefreshToken(JWTToken: string, rememberMe: boolean) {
    this.cookieService.set('RefreshToken', JWTToken, {
      expires: rememberMe ? this.cookieSettings.expirationPeriod : undefined,
      secure: this.cookieSettings.useSecure,
      domain: 'flashmemo.edu',
    });
  }

  protected clearPreExistingTokens() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  protected clearPreExistingCookies() {
    this.cookieService.delete('RefreshToken');
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
    this.storeAccessToken(res.accessToken, rememberMe);
    this.setRefreshToken(res.refreshToken, rememberMe);

    this.loggedUser.next(this.decodeUserFromAccessToken());

    this.showAuthSpinner(SpinnerType.LOGIN);
  }

  public handleCredentials(res: ILoginResponse, rememberMe: boolean) {
    this.storeAccessToken(res.accessToken, rememberMe);
    this.setRefreshToken(res.refreshToken, rememberMe);

    this.loggedUser.next(this.decodeUserFromAccessToken());
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

  abstract renewAccessToken(
    expiredAccessToken: string
  ): Observable<ILoginResponse>;
}

@Injectable({
  providedIn: 'root',
})
export class MockAuthService extends GenericAuthService {
  /**
    "jti": "dcafb113-7794-49db-8cde-42b7f1875fd3",
    "sub": "1234567890",
    "username": "johndoe",
    "name": "John",
    "surname": "Doe",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "admin",
    "exp": 9999999999
    */
  protected dummyAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZmxhc2htZW1vLmVkdSIsImp0aSI6ImRjYWZiMTEzLTc3OTQtNDlkYi04Y2RlLTQyYjdmMTg3NWZkMyIsInN1YiI6IjEyMzQ1Njc4OTAiLCJ1c2VybmFtZSI6ImpvaG5kb2UiLCJuYW1lIjoiSm9obiIsInN1cm5hbWUiOiJEb2UiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.2Oqyj7_bUwTFKQvL4ZDeWVnG3E0iTXfNIz2eLiKXnTE';

  /**
    "jti": "619449c6-f12f-4c3b-baaa-db5e65578578",
    "sub": "dcafb113-7794-49db-8cde-42b7f1875fd3",
    "username": "johndoe",
    "iat": 1516239022,
    "exp": 9999999999
      */
  protected dummyRefreshToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MTk0NDljNi1mMTJmLTRjM2ItYmFhYS1kYjVlNjU1Nzg1NzgiLCJzdWIiOiJkY2FmYjExMy03Nzk0LTQ5ZGItOGNkZS00MmI3ZjE4NzVmZDMiLCJ1c2VybmFtZSI6ImpvaG5kb2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.HPrTmB5ggMe_awsJfJUGM4dIhDcO1NVbzrXfklA7uac';

  constructor(
    protected jwtHelper: JwtHelperService,
    protected router: Router,
    protected notificationService: GenericNotificationService,
    protected spinnerService: NgxSpinnerService,
    protected cookieService: CookieService,
    @Inject('COOKIE_CONFIG')
    protected cookieSettings: { useSecure: boolean; expirationPeriod: number }
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
          accessToken: this.dummyAccessToken,
          refreshToken: this.refreshToken,
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

  renewAccessToken(expiredAccessToken: string): Observable<ILoginResponse> {
    return of({
      accessToken: this.dummyAccessToken,
      refreshToken: this.dummyRefreshToken,
      message: 'Access renewed.',
      errors: [],
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends GenericAuthService {
  protected authServiceURL: string = `${this.config.backendAddress}/api/v1/Auth`;
  protected userServiceURL: string = `${this.config.backendAddress}/api/v1/User`;
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
    @Inject('COOKIE_CONFIG')
    protected cookieSettings: { useSecure: boolean; expirationPeriod: number }
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

  renewAccessToken(expiredAccessToken: string): Observable<ILoginResponse> {
    console.log(
      'Attempting to renew the following expired token',
      expiredAccessToken
    );
    console.log('Cookie value is...', this.refreshToken);
    return this.http.post<ILoginResponse>(
      `${this.authServiceURL}/refresh`,
      { expiredAccessToken: expiredAccessToken },
      {
        headers: {
          RefreshToken: this.refreshToken,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
  }
}
