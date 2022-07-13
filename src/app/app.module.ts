import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { CollapseModule } from 'ngx-bootstrap/collapse'; // boostrap collapsable
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; // boostrap dropbdown
import { ToastrModule } from 'ngx-toastr'; // Toastr
import {
  ConfigOption,
  FormlyFieldConfig,
  FormlyModule,
} from '@ngx-formly/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './root/routing/app-routing.module';
import { NewsModule } from './news/news.module';
import { DeckModule } from './deck/deck.module';
import { FlashMEMOAuthGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './root/components/login/login.component';
import { HomeComponent } from './root/components/home/home.component';
import { AppComponent } from './root/components/app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from 'ckeditor4-angular';
import { BrowserModule } from '@angular/platform-browser';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { ErrorHandler, Inject, NgModule } from '@angular/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {
  DeckRepositoryResolverService,
  NewsRepositoryResolverService,
  UserRepositoryResolverService,
} from './shared/resolvers/generic-repository.resolver';
import {
  GenericNotificationService,
  NotificationService,
} from './shared/services/notification/notification.service';
import { GlobalHttpInterceptorService } from './shared/interceptor/http-error.interceptor';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { TestModule } from './test/test.module';
import { SpinnerService } from './shared/services/UI/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import {
  IFlashMEMOLoggerOptions,
  LoggerService,
  ServerCustomisedService,
} from './shared/services/logging/logger.service';
import { LoggerModule, TOKEN_LOGGER_SERVER_SERVICE } from 'ngx-logger';
import { JumbotronComponent } from './root/components/common/jumbotron/jumbotron.component';
import { MethodComponent } from './root/components/method/method.component';
import { ActivateAccountComponent } from './root/components/activate-account/activate-account.component';
import { PasswordResetComponent } from './root/components/password-reset/password-reset.component';
import {
  ApmErrorHandler,
  ApmModule,
  ApmService,
} from '@elastic/apm-rum-angular';

// FOR REFERENCE: these function must either return 'null' on success, or a 'ValidationError' object on fail. Therefore, if there is something like '{ fieldMatch: true }', which could mean a successful validation, it will actually be interpreted as a failed one, since it's a 'ValidationError' object.
export function passwordMatchValidator(control: AbstractControl) {
  const { password, passwordConfirm } = control.value;

  // avoid displaying the message error when values are empty
  if (!passwordConfirm || !password) {
    return null;
  }

  if (passwordConfirm === password) {
    return null;
  }

  return { passwordMatch: { message: 'Passwords do not match.' } };
}

/** Implementing these custom validator are a real pain in the ass. At least this is working. For now. */
export function passwordRequirementsValidator(control: AbstractControl) {
  const password = control.value;
  // Just take a look on how many regex I had to test before settling with the correct one... jesus fucking christ (PS: I'll admit it, I wasn't pasting the regex using the specialized syntax, that might have cause extra trouble)
  const regex = new RegExp(
    // '^[(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[^da-zA-Z])].{8,}$'
    // `(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$`
    // '(?=^.{8,}$)((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$'
    // "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );
  const regexCheck = regex.test(password);

  if (!password || regexCheck) {
    return null;
  }
  return { passwordRequirements: false };
}

export function dateFutureValidator(
  control: AbstractControl,
  field: FormlyFieldConfig,
  options = {}
) {
  console.log(
    new Date(control.value),
    new Date(),
    new Date(control.value) >= new Date()
  );
  return new Date(control.value) >= new Date()
    ? null
    : { 'date-future': false };
}

export function emailValidator(control: AbstractControl) {
  const email = control.value;
  const regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

  const regexCheck = regex.test(email);

  if (!email || regexCheck) {
    return null;
  }
  return { email: false };
}

export const formlyConfig: ConfigOption = {
  validators: [
    { name: 'passwordMatch', validation: passwordMatchValidator },
    { name: 'email', validation: emailValidator },
    { name: 'passwordRequirements', validation: passwordRequirementsValidator },
    {
      name: 'date-future',
      validation: dateFutureValidator,
    },
  ],
  validationMessages: [
    { name: 'required', message: 'This field is required.' },
    { name: 'email', message: 'This is not a valid email.' },
    {
      name: 'passwordRequirements',
      message:
        'Password must contain at least 8 characters, one digit, one lowercase letter, one uppercase letter, and one special digit.',
    },
    { name: 'passwordMatch', message: 'Passwords do not match.' },
    {
      name: 'date-future',
      message: 'Date must be set in the future.',
    },
  ],
};

export type RepositoryServiceConfig = {
  backendAddress: string;
  maxPageSize: number;
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    JumbotronComponent,
    MethodComponent,
    ActivateAccountComponent,
    PasswordResetComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    NewsModule,
    DeckModule,
    TestModule,
    BrowserAnimationsModule,
    LoggerModule.forRoot(null, {
      serverProvider: {
        provide: TOKEN_LOGGER_SERVER_SERVICE,
        useClass: ServerCustomisedService,
      },
    }),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          if (sessionStorage.getItem('token')) {
            return sessionStorage.getItem('token');
          }
          return localStorage.getItem('token');
        },
      },
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      countDuplicates: true,
      maxOpened: 3,
      timeOut: 5000,
    }),
    ReactiveFormsModule,
    FormlyModule.forRoot(formlyConfig),
    FormlyMaterialModule,
    NgxSpinnerModule, // NGX-Spinner
    CKEditorModule,
    NgbModule,
    ClipboardModule,
    ApmModule,
  ],
  providers: [
    {
      provide: 'LOGGER_CONFIG',
      useValue: {
        sinks: environment.loggerConfig.sinks,
        logLevel: environment.loggerConfig.logLevel,
        serverLogLevel: environment.loggerConfig.serverLogLevel,
        logServerURL: environment.loggerConfig.logServerURL,
      } as IFlashMEMOLoggerOptions,
    },
    {
      provide: 'REPOSITORY_SERVICE_CONFIG',
      useValue: {
        backendAddress: environment.backendRootAddress,
        maxPageSize: environment.maxPageSize,
      },
    },
    {
      provide: 'COOKIE_CONFIG',
      useValue: {
        useSecure: environment.production,
        expirationPeriod: environment.expirationPeriod,
      },
    },
    {
      provide: 'GeneralImageAPIService',
      useClass: environment.imageAPIService,
    },
    {
      provide: 'GeneralDictionaryAPIService',
      useClass: environment.dictionaryAPIService,
    },
    {
      provide: 'GeneralAudioAPIService',
      useClass: environment.audioAPIService,
    },
    { provide: 'GenericDeckService', useClass: environment.deckService },
    {
      provide: 'GenericFlashcardService',
      useClass: environment.flashcardService,
    },
    {
      provide: 'GenericLanguageService',
      useClass: environment.languageService,
    },
    { provide: 'GenericAuthService', useClass: environment.authService },
    { provide: 'GenericUserService', useClass: environment.userService },
    { provide: 'GenericNewsService', useClass: environment.newsService },
    {
      provide: 'GenericUserStatsService',
      useClass: environment.userStatsService,
    },

    { provide: DeckRepositoryResolverService },
    { provide: UserRepositoryResolverService },
    { provide: NewsRepositoryResolverService },
    { provide: 'GenericNotificationService', useClass: NotificationService },
    { provide: 'GenericSpinnerService', useClass: SpinnerService },
    { provide: 'GenericLoggerService', useClass: LoggerService },
    { provide: CookieService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true,
    },
    {
      // For APM integration
      provide: ErrorHandler,
      useClass: ApmErrorHandler,
    },

    { provide: DatePipe },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(@Inject(ApmService) service: ApmService) {
    // Agent API is exposed through this apm instance
    const apm = service.init({
      serviceName: 'flashmemo-website',
      serverUrl: 'http://localhost:8200',
    });

    apm.setUserContext({
      username: 'foo',
      id: 'bar',
    });
  }
}

/**
 * NGX-Spinner: contains a bunch of spinner templates, and options for them. Main instructions here: https://www.npmjs.com/package/ngx-spinner. Spinner tester here: https://napster2210.github.io/ngx-spinner/
 * CKEditor: common use RTE. Main documentation here: . This link has some instructions on how to set up a custom build of the widget: https://stackoverflow.com/questions/55654872/create-a-custom-plugin-on-ckeditor-for-angular-application. Main documentation for the widget here: https://ckeditor.com/docs/ckeditor4/latest/guide/dev_angular.html#customizing-ckeditor-preset-or-version. *** Something that crossed my mind was using the template tools from the widget to make fully customizable content blocks... ***
 * NG-Bootstrap and NGX-Bootstrap: two modules that offer bootstrap components with Angular implementation. After much investigation, it is now assumed that using both libraries is not conceptually wrong, since they offer different components between each other.
 * NGX-Clipboard: allows to implement functions that copy contents to the user's clipboard. Source: https://www.npmjs.com/package/ngx-clipboard.
 */
