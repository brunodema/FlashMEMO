import { HttpClientModule } from '@angular/common/http';
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
  IAuthService,
  MockAuthService,
} from './shared/services/auth.service';
import { AuthGuard } from './shared/guards/auth.guard';

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
import { DeckRepositoryResolverService } from './shared/resolvers/generic-repository.resolver';
import {
  AudioService,
  DictionaryService,
  GeneralAudioAPIService,
  GeneralDictionaryAPIService,
  GeneralImageAPIService,
  ImageAPIService,
  MockAudioService,
  MockDictionaryService,
  MockImageAPIService,
} from './shared/services/api-services';

export function fieldMatchValidator(control: AbstractControl) {
  const { password, passwordConfirm } = control.value;

  // avoid displaying the message error when values are empty
  if (!passwordConfirm || !password) {
    return null;
  }

  if (passwordConfirm === password) {
    return null;
  }

  return { fieldMatch: { message: 'Password Not Matching' } };
}

const config: ConfigOption = {
  validationMessages: [
    { name: 'required', message: 'This field is required' },
    { name: 'emailIsValid', message: 'This is not a valid email' },
    { name: 'passwordMatch', message: 'The password must match' },
  ],
  validators: [{ name: 'fieldMatch', validation: fieldMatchValidator }],
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
    }),
    ReactiveFormsModule,
    FormlyModule.forRoot(config),
    FormlyMaterialModule,
    NgxSpinnerModule, // NGX-Spinner
    CKEditorModule,
    NgbModule,
    ClipboardModule,
  ],
  providers: [
    { provide: GeneralImageAPIService, useClass: ImageAPIService },
    { provide: GeneralDictionaryAPIService, useClass: DictionaryService },
    { provide: GeneralAudioAPIService, useClass: AudioService },
    { provide: IAuthService, useClass: AuthService },
    AuthGuard,
    { provide: GenericDeckService, useClass: DeckService },
    { provide: GenericFlashcardService, useClass: FlashcardService },
    { provide: GenericLanguageService, useClass: LanguageService },
    {
      provide: DeckRepositoryResolverService,
      useClass: DeckRepositoryResolverService,
    },
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
