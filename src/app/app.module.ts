import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { CollapseModule } from 'ngx-bootstrap/collapse'; // boostrap collapsable
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; // boostrap dropbdown
import { ToastrModule } from 'ngx-toastr'; // Toastr
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './root/routing/app-routing.module';
import { NewsModule } from './news/news.module';
import { DeckModule } from './deck/deck.module';

import {
  AuthService,
  GenericAuthService,
  MockAuthService,
} from './shared/services/auth.service';
import { FlashMEMOAuthGuard } from './shared/guards/auth.guard';

import { LoginComponent } from './root/components/login/login.component';
import { HomeComponent } from './root/components/home/home.component';
import { AppComponent } from './root/components/app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from 'ckeditor4-angular';
import { BrowserModule } from '@angular/platform-browser';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { NgModule } from '@angular/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {
  DeckService,
  GenericDeckService,
  MockDeckService,
} from './deck/services/deck.service';
import {
  GenericLanguageService,
  LanguageService,
  MockLanguageService,
} from './shared/services/language.service';
import {
  FlashcardService,
  GenericFlashcardService,
  MockFlashcardService,
} from './shared/services/flashcard.service';
import {
  DeckRepositoryResolverService,
  NewsRepositoryResolverService,
  UserRepositoryResolverService,
} from './shared/resolvers/generic-repository.resolver';
import {
  GeneralImageAPIService,
  ImageAPIService,
  MockImageAPIService,
} from './shared/services/APIs/image-api.service';
import {
  DictionaryService,
  GeneralDictionaryAPIService,
  MockDictionaryService,
} from './shared/services/APIs/dictionary-api.service';
import {
  AudioService,
  GeneralAudioAPIService,
  MockAudioService,
} from './shared/services/APIs/audio-api.service';
import {
  GenericNotificationService,
  NotificationService,
} from './shared/services/notification/notification.service';
import { GlobalHttpInterceptorService } from './shared/interceptor/http-error.interceptor';
import {
  GenericUserService,
  MockUserService,
  UserService,
} from './user/services/user.service';
import { DatePipe } from '@angular/common';
import {
  GenericNewsService,
  MockNewsService,
  NewsService,
} from './news/services/news.service';
import { environment } from 'src/environments/environment';
import { TestModule } from './test/test.module';

export function fieldMatchValidator(control: AbstractControl) {
  const password = control.value['password'];
  const passwordConfirm = control.value['passwordConfirm'];

  // avoid displaying the message error when values are empty
  if (!passwordConfirm || !password) {
    return null;
  }

  if (passwordConfirm === password) {
    return null;
  }

  return { fieldMatch: { message: 'Password Not Matching' } };
}

export const formlyConfig: ConfigOption = {
  validationMessages: [
    { name: 'required', message: 'This field is required' },
    { name: 'emailIsValid', message: 'This is not a valid email' },
    { name: 'passwordMatch', message: 'The password must match' },
  ],
  validators: [{ name: 'fieldMatch', validation: fieldMatchValidator }],
};

export type RepositoryServiceConfig = {
  backendAddress: string;
  maxPageSize: number;
};

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    NewsModule,
    DeckModule,
    TestModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
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
  ],
  providers: [
    // { provide: GeneralImageAPIService, useClass: MockImageAPIService },
    // { provide: GeneralDictionaryAPIService, useClass: MockDictionaryService },
    // { provide: GeneralAudioAPIService, useClass: MockAudioService },
    // { provide: GenericDeckService, useClass: MockDeckService },
    // { provide: GenericFlashcardService, useClass: MockFlashcardService },
    // { provide: GenericLanguageService, useClass: MockLanguageService },
    // { provide: GenericAuthService, useClass: MockAuthService },
    // { provide: GenericUserService, useClass: MockUserService },
    // { provide: GenericNewsService, useClass: MockNewsService },
    {
      provide: 'REPOSITORY_SERVICE_CONFIG',
      useValue: {
        backendAddress: environment.backendRootAddress,
        maxPageSize: environment.maxPageSize,
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

    FlashMEMOAuthGuard,
    { provide: DeckRepositoryResolverService },
    { provide: UserRepositoryResolverService },
    { provide: NewsRepositoryResolverService },
    { provide: GenericNotificationService, useClass: NotificationService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true,
    },
    { provide: DatePipe },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

/**
 * NGX-Spinner: contains a bunch of spinner templates, and options for them. Main instructions here: https://www.npmjs.com/package/ngx-spinner. Spinner tester here: https://napster2210.github.io/ngx-spinner/
 * CKEditor: common use RTE. Main documentation here: . This link has some instructions on how to set up a custom build of the widget: https://stackoverflow.com/questions/55654872/create-a-custom-plugin-on-ckeditor-for-angular-application. Main documentation for the widget here: https://ckeditor.com/docs/ckeditor4/latest/guide/dev_angular.html#customizing-ckeditor-preset-or-version. *** Something that crossed my mind was using the template tools from the widget to make fully customizable content blocks... ***
 * NG-Bootstrap and NGX-Bootstrap: two modules that offer bootstrap components with Angular implementation. After much investigation, it is now assumed that using both libraries is not conceptually wrong, since they offer different components between each other.
 * NGX-Clipboard: allows to implement functions that copy contents to the user's clipboard. Source: https://www.npmjs.com/package/ngx-clipboard.
 */
