import { Component, Inject, OnInit } from '@angular/core';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { LoggerService } from 'src/app/shared/services/logging/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    @Inject('GenericLoggerService')
    protected loggerService: LoggerService,
    @Inject('GenericAuthService')
    public authService: GenericAuthService
  ) {}
}
