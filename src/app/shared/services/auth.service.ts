import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Guid } from 'guid-ts';
import { ToastrService } from 'ngx-toastr';
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

export abstract class GenericAuthService {
  protected homeAddress = '/home';

  constructor(
    protected jwtHelper: JwtHelperService,
    protected router: Router,
    protected notificationService: GenericNotificationService
  ) {}

  private decodeUserFromToken(jwtToken: string): User {
    return new User({
      id: this.decodePropertyFromToken('sub') ?? Guid.newGuid(),
      email: this.decodePropertyFromToken('email') ?? 'johndoe@flashmemo.edu',
      name: this.decodePropertyFromToken('name') ?? 'John',
      surname: this.decodePropertyFromToken('surname') ?? 'Doe',
      username: this.decodePropertyFromToken('username') ?? 'johndoe',
    });
  }

  // TIL about Subject/BehaviorSubject. "A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners" (source: https://rxjs.dev/guide/subject). Implementation taken from here: https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243
  public loggedUser = new BehaviorSubject<User>(this.decodeUserFromToken(''));

  /**
   * Checks if the JWT contains the Microsfot schema entry for role, and if so, checks if the value matches for an admin.
   */
  private _isLoggedUserAdmin: boolean = false;
  get isLoggedUserAdmin(): boolean {
    console.log('checking if user is admin...', this.checkIfAdmin());
    return this.checkIfAdmin();
  }

  abstract login(requestData: ILoginRequest): Observable<any>;
  abstract register(registerData: IRegisterRequest): Observable<any>;

  /**
   * Checks if the logged user (verifies stored JWT) has an admin claim in his/hers credentials.
   * @returns
   */
  protected checkIfAdmin(): boolean {
    return (
      this.decodePropertyFromToken(
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ) === 'admin'
    );
  }

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
    this.loggedUser.next(new User());
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
    this.loggedUser.next(this.decodeUserFromToken(res.jwtToken));
    this.notificationService
      .showSuccess('You will soon be redirected.', 'Welcome to FlashMEMO!')
      .onHidden.subscribe(() => this.redirectToHome());
  }

  protected handleSuccessfulRegistration(res: IBaseAPIResponse) {
    // leave this empty JUST IN CASE I need to add logic here in the future. This used to show the success notification, but I'm moving this out of servie logic.
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

@Injectable({
  providedIn: 'root',
})
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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZmxhc2htZW1vLmVkdSIsImp0aSI6ImRjYWZiMTEzLTc3OTQtNDlkYi04Y2RlLTQyYjdmMTg3NWZkMyIsInN1YiI6IjEyMzQ1Njc4OTAiLCJ1c2VybmFtZSI6IkpvaG4gRG9lIiwibmFtZSI6IkpvaG4iLCJzdXJuYW1lIjoiRG9lIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiYWRtaW4iLCJleHAiOjk5OTk5OTk5OTl9.RjQl-_1AMm1qekxdItV8pBndguQtHiPXs8DXNgy-XZc',
        errors: [],
        message: 'success',
      })
    );
  }

  register(registerData: IRegisterRequest): Observable<any> {
    return of(
      // this.handleSuccessfulRegistration({
      //   errors: [],
      //   message: 'Success',
      //   status: '200',
      // }),
      this.login({
        username: registerData.username,
        password: registerData.password,
      }).subscribe()
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
    protected notificationService: GenericNotificationService
  ) {
    super(jwtHelper, router, notificationService);
  }

  public login(requestData: ILoginRequest): Observable<any> {
    return this.http
      .post<ILoginResponse>(`${this.authServiceURL}/login`, requestData)
      .pipe(
        map((res) => this.handleSuccessfulLogin(res)),
        catchError((err: HttpErrorResponse) => this.handleFailedLogin(err))
      );
  }

  public register(registerData: IRegisterRequest): Observable<any> {
    return this.http
      .post<IBaseAPIResponse>(`${this.userServiceURL}/create`, registerData)
      .pipe(
        map((res) => {
          this.handleSuccessfulRegistration(res);
          this.login({
            username: registerData.username,
            password: registerData.password,
          }).subscribe();
        }),
        catchError((err: HttpErrorResponse) => this.handleFailedLogin(err))
      );
  }
}
