import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // for bootstrap animations
import { CollapseModule } from 'ngx-bootstrap/collapse'; // boostrap collapsable
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; // boostrap dropbdown
import { ToastrModule } from 'ngx-toastr'; // Toastr
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './root/routing/app-routing.module';
import { NewsModule } from './news/news.module';
import { DeckModule } from './deck/deck.module';

import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/guards/auth.guard';

import { LoginComponent } from './root/components/login/login.component';
import { HomeComponent } from './root/components/home/home.component';
import { AppComponent } from './root/components/app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QuillModule } from 'ngx-quill';

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
    // custom modules
    SharedModule,
    AppRoutingModule,
    NewsModule,
    DeckModule,
    // boostrap collapsable
    BrowserAnimationsModule, // (used by NGX-Spinner)
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
    FormlyBootstrapModule,
    NgxSpinnerModule, // NGX-Spinner
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction
          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ['clean'], // remove formatting button
          ['link', 'image', 'video'], // link and image, video
        ],
      },
    }), // NGX-Quill
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}

/**
 * NGX-Spinner: contains a bunch of spinner templates, and options for them. Main instructions here: https://www.npmjs.com/package/ngx-spinner. Spinner tester here: https://napster2210.github.io/ngx-spinner/
 * NGX-Quill: alternative text editor in place of CKEditor (2022 and no proper TypeScript support). Documentation here: https://openbase.com/js/ngx-quill. Had to follow steps from here to fix installation issue: https://github.com/KillerCodeMonkey/ngx-quill/issues/247.
 */
