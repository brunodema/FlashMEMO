import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  IDataResponse,
  ILoginResponse,
} from '../models/http/http-response-types';
import { GenericLoggerService } from './logging/logger.service';
import { GenericNotificationService } from './notification/notification.service';
import { SpinnerType } from './UI/spinner.service';

export abstract class GenericAuthService {
  protected homeAddress = '/home';

  constructor(
    protected jwtHelper: JwtHelperService,
    protected router: Router,
    @Inject('GenericNotificationService')
    protected notificationService: GenericNotificationService,
    protected spinnerService: NgxSpinnerService,
    protected cookieService: CookieService,
    @Inject('COOKIE_CONFIG')
    protected cookieSettings: { useSecure: boolean; expirationPeriod: number },
    protected modalService: NgbModal,
    @Inject('GenericLoggerService')
    protected loggerService: GenericLoggerService
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

  /**
   * For any value different than 'null' to be returned, the following must be true. (1) There must exist an access token in the browser's store; (2) A valid refresh token associated with the access token must exist in the brower's cookies.
   * @returns
   */
  private decodeUserFromAccessToken(): User | null {
    if (this.accessToken) {
      const decodedAT = this.jwtHelper.decodeToken(this.accessToken);
      const decodedRT = this.jwtHelper.decodeToken(this.refreshToken);

      this.loggerService.logDebug(
        `Access token has ${new Date(
          this.jwtHelper.getTokenExpirationDate(this.accessToken)!.getTime() -
            new Date().getTime()
        ).getTime()}ms until expiration.`
      );

      this.loggerService.logDebug(
        `Refresh token has ${new Date(
          this.jwtHelper.getTokenExpirationDate(this.refreshToken)!.getTime() -
            new Date().getTime()
        ).getTime()}ms until expiration.`
      );

      if (!decodedAT || !decodedRT) return null;

      const expirationCheck = !this.jwtHelper.isTokenExpired(this.refreshToken);
      const subjectCheck = decodedAT['jti'] === decodedRT['sub'];
      if (!subjectCheck) {
        this.loggerService.logDebug(decodedAT['jti'], decodedRT['sub']);
        throw new Error(
          'Subject check has failed for stored credentials (i.e., tokens are not related to each other.)'
        );
      }

      const userCheck = decodedAT['sub'] === decodedRT['userid'];

      this.loggerService.logDebug(
        'Token check for user mapping done.',
        decodedAT,
        decodedRT,
        `expiration check is: ${expirationCheck}, but access token validity is: ${!this.jwtHelper.isTokenExpired(
          this.accessToken
        )}`,
        `subject check is: ${subjectCheck}`,
        `user check is: ${userCheck}`
      );

      if (expirationCheck && subjectCheck && userCheck) {
        return new User({
          id:
            this.decodePropertyFromToken(this.accessToken, 'sub') ??
            Guid.newGuid(),
          email:
            this.decodePropertyFromToken(this.accessToken, 'email') ??
            'johndoe@flashmemo.edu',
          name:
            this.decodePropertyFromToken(this.accessToken, 'name') ?? 'John',
          surname:
            this.decodePropertyFromToken(this.accessToken, 'surname') ?? 'Doe',
          username:
            this.decodePropertyFromToken(this.accessToken, 'username') ??
            'johndoe',
        });
      }
      this.loggerService.logDebug(
        'Check have failed, returning user as "null"'
      );
      return null;
    }
    this.loggerService.logDebug(
      'No existing access token detected, returning user as "null"'
    );
    return null;
  }

  // TIL about Subject/BehaviorSubject. "A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners" (source: https://rxjs.dev/guide/subject). Implementation taken from here: https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243
  public loggedUser = new BehaviorSubject<User | null>(
    this.decodeUserFromAccessToken()
  );

  isLoggedUserAdmin(): boolean {
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

  protected storeAccessToken(JWTToken: string, rememberMe: boolean) {
    this.clearPreExistingTokens();

    if (rememberMe) {
      localStorage.setItem('token', JWTToken);
    } else {
      sessionStorage.setItem('token', JWTToken);
    }
  }

  protected setRefreshToken(JWTToken: string, rememberMe: boolean) {
    this.cookieService.delete('RefreshToken');
    this.cookieService.set('RefreshToken', JWTToken, {
      expires: rememberMe ? this.cookieSettings.expirationPeriod : undefined,
      secure: this.cookieSettings.useSecure,
      domain: 'flashmemo.edu',
      path: '/',
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

  public hasNonExpiredAccessTokenStored(): boolean {
    return !this.jwtHelper.isTokenExpired(this.accessToken);
  }

  /** To be able to renew an access token, the front-end will require that an access token exists (regardless if expire, invalid, etc), and that a non-expired refreshToken exists. */
  public canAttemptTokenRenewal(): boolean {
    this.loggerService.logDebug(
      'Checking if token renewal is possible...',
      this.accessToken,
      this.refreshToken,
      'is AT expired? ' + this.jwtHelper.isTokenExpired(this.accessToken),
      'is RT expired? ' + this.jwtHelper.isTokenExpired(this.refreshToken)
    );
    return (
      this.accessToken?.length > 0 &&
      !this.jwtHelper.isTokenExpired(this.refreshToken)
    );
  }

  protected handleSuccessfulLogin(res: ILoginResponse, rememberMe: boolean) {
    this.handleCredentials(res, rememberMe);
    this.showAuthSpinner(SpinnerType.LOGIN);
  }

  public handleCredentials(res: ILoginResponse, rememberMe: boolean) {
    this.clearPreExistingTokens();
    this.clearPreExistingCookies();

    this.storeAccessToken(res.accessToken, rememberMe);
    this.setRefreshToken(res.refreshToken, rememberMe);

    this.loggedUser.next(this.decodeUserFromAccessToken());
  }

  public logout() {
    this.disconnectUser();
    this.showAuthSpinner(SpinnerType.LOGOUT);
  }

  public disconnectUser() {
    this.loggerService.logDebug('Disconnecting user...');
    this.clearPreExistingTokens();
    this.clearPreExistingCookies();
    this.modalService.dismissAll();

    this.loggedUser.next(null);
  }

  protected handleSuccessfulRegistration(res: IBaseAPIResponse) {
    // leave this empty JUST IN CASE I need to add logic here in the future. This used to show the success notification, but I'm moving this out of service logic.
  }

  protected handleFailedLogin(err: HttpErrorResponse) {
    this.clearPreExistingTokens();
    return throwError(() => err);
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

  abstract activateAccount(token: string): Observable<any>;

  abstract forgotPassword(email: string): Observable<any>;

  abstract resetPassword(
    username: string,
    token: string,
    newPassword: string
  ): Observable<any>;
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
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZmxhc2htZW1vLmVkdSIsImp0aSI6ImRjYWZiMTEzLTc3OTQtNDlkYi04Y2RlLTQyYjdmMTg3NWZkMyIsInN1YiI6IjEyMzQ1Njc4OTAiLCJ1c2VybmFtZSI6ImpvaG5kb2UiLCJuYW1lIjoiSm9obiIsInN1cm5hbWUiOiJEb2UiLCJpYXQiOjE1MTYyMzkwMjIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImFkbWluIiwiZXhwIjo5OTk5OTk5OTk5fQ.Ltt645uDST3Qo1dDYXq0fceyUfmTFJVP0AxE8-O8n8o';

  /**
    "jti": "619449c6-f12f-4c3b-baaa-db5e65578578",
    "sub": "dcafb113-7794-49db-8cde-42b7f1875fd3",
    "userid": "1234567890",
    "iat": 1516239022,
    "exp": 9999999999
      */
  protected dummyRefreshToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MTk0NDljNi1mMTJmLTRjM2ItYmFhYS1kYjVlNjU1Nzg1NzgiLCJzdWIiOiJkY2FmYjExMy03Nzk0LTQ5ZGItOGNkZS00MmI3ZjE4NzVmZDMiLCJ1c2VyaWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.9MNZG15gJI5j8deZUlqqexvH5F_fbW_AR3CW1_yViu8';

  constructor(
    protected jwtHelper: JwtHelperService,
    protected router: Router,
    @Inject('GenericNotificationService')
    protected notificationService: GenericNotificationService,
    protected spinnerService: NgxSpinnerService,
    protected cookieService: CookieService,
    @Inject('COOKIE_CONFIG')
    protected cookieSettings: { useSecure: boolean; expirationPeriod: number },
    protected modalService: NgbModal,
    @Inject('GenericLoggerService')
    protected loggerService: GenericLoggerService
  ) {
    super(
      jwtHelper,
      router,
      notificationService,
      spinnerService,
      cookieService,
      cookieSettings,
      modalService,
      loggerService
    );
  }

  login(requestData: ILoginRequest, rememberMe: boolean): Observable<any> {
    return of(
      this.handleSuccessfulLogin(
        {
          accessToken: this.dummyAccessToken,
          refreshToken: this.dummyRefreshToken,
          errors: [],
          message: 'success',
        },
        rememberMe
      )
    );
  }

  register(registerData: IRegisterRequest): Observable<any> {
    return of({});
  }

  renewAccessToken(expiredAccessToken: string): Observable<ILoginResponse> {
    return of({
      accessToken: this.dummyAccessToken,
      refreshToken: this.dummyRefreshToken,
      message: 'Access renewed.',
      errors: [],
    });
  }

  activateAccount(token: string): Observable<any> {
    if (token) {
      this.loggerService.logDebug(
        "A token value was provided to the 'activateAccount' method... returning success..."
      );
      return of({});
    } else {
      this.loggerService.logDebug(
        "A token value was not provided to the 'activateAccount' method... returning failure..."
      );
      throw Error('Failed to activate account (mock error)');
    }
  }

  forgotPassword(email: string): Observable<any> {
    if (email) {
      this.loggerService.logDebug(
        "An email value was provided to the 'forgotPassword' method... returning success..."
      );
      return of({});
    } else {
      this.loggerService.logDebug(
        "An email value was not provided to the 'forgotPassword' method... returning failure..."
      );
      throw Error('Failed to request password reset link (mock error)');
    }
  }

  resetPassword(
    username: string,
    token: string,
    newPassword: string
  ): Observable<any> {
    if (username && token && newPassword) {
      this.loggerService.logDebug(
        "All values provided to the 'resetPassword' method... returning success..."
      );
      return of({});
    } else {
      this.loggerService.logDebug(
        "Values missing for the 'resetPassword' method... returning failure..."
      );
      throw Error('Failed to reset password (mock error)');
    }
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
    @Inject('GenericNotificationService')
    protected notificationService: GenericNotificationService,
    protected spinnerService: NgxSpinnerService,
    protected cookieService: CookieService,
    @Inject('COOKIE_CONFIG')
    protected cookieSettings: { useSecure: boolean; expirationPeriod: number },
    protected modalService: NgbModal,
    @Inject('GenericLoggerService')
    protected loggerService: GenericLoggerService
  ) {
    super(
      jwtHelper,
      router,
      notificationService,
      spinnerService,
      cookieService,
      cookieSettings,
      modalService,
      loggerService
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
    return this.http.post<IDataResponse<string>>(
      `${this.authServiceURL}/register`,
      registerData
    );
  }

  renewAccessToken(expiredAccessToken: string): Observable<ILoginResponse> {
    this.loggerService.logDebug(
      'Attempting to renew the following expired token',
      expiredAccessToken
    );
    this.loggerService.logDebug('Cookie value is...', this.refreshToken);

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

  activateAccount(token: string): Observable<any> {
    return this.http.post<IBaseAPIResponse>(`${this.authServiceURL}/activate`, {
      activationToken: token,
    });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<IBaseAPIResponse>(
      `${this.authServiceURL}/forgot-password`,
      {
        email: email,
      }
    );
  }

  resetPassword(
    username: string,
    token: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post<IBaseAPIResponse>(
      `${this.authServiceURL}/reset-password`,
      {
        username: username,
        token: token,
        newPassword: newPassword,
      }
    );
  }
}
