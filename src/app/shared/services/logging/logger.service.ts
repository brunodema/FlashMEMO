import { Injectable } from '@angular/core';
import { Logger } from 'tslog';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  protected loggerInstance: Logger;

  constructor() {
    this.loggerInstance = new Logger();
  }
}
