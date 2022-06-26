import { Component, Inject, OnInit } from '@angular/core';
import { GenericLoggerService } from 'src/app/shared/services/logging/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    @Inject('GenericLoggerService')
    protected loggerService: GenericLoggerService
  ) {}

  ngOnInit(): void {}
}
