import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NewsModule } from './news/news.module';
import { SharedModule } from './shared/shared.module';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // for bootstrap animations
import { CollapseModule } from 'ngx-bootstrap/collapse'; // boostrap collapsable
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; // boostrap dropbdown
import { ToastrModule } from 'ngx-toastr'; // Toastr

import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/guards/auth.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { UserPreferencesDropdownComponent } from './shared/components/user-preferences-dropdown/user-preferences-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    UserPreferencesDropdownComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NewsModule,
    SharedModule,
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
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
