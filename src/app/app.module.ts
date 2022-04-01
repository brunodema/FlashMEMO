// Modules
// base
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
// custom
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NewsModule } from './news/news.module';
import { DeckModule } from './deck/deck.module';

// Services and Guards
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/guards/auth.guard';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

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
    FormlyBootstrapModule,
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
