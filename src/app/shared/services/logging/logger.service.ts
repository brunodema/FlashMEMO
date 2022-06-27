import { Inject, Injectable } from '@angular/core';
import { Logger } from 'tslog';

export interface IFlashMEMOLoggerOptions {
  logLevel: 'DEBUG' | 'TRACE' | 'WARNING' | 'INFORMATION' | 'ERROR';
  provider: 'CONSOLE' | 'API';
}

export interface IFlashMEMOLogger {
  logDebug(): void;
  logTrace(): void;
  logError(): void;
  logInformation(): void;
  logWarning(): void;
}

export abstract class GenericLoggerService implements IFlashMEMOLogger {
  protected loggerInstance: Logger;

  constructor() {
    this.loggerInstance = new Logger();
  }

  logInformation(): void {
    this.loggerInstance.info();
  }
  logDebug(): void {
    this.loggerInstance.debug();
  }
  logTrace(): void {
    this.loggerInstance.trace();
  }
  logError(): void {
    this.loggerInstance.error();
  }
  logWarning(): void {
    this.loggerInstance.warn();
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService extends GenericLoggerService {
  constructor(
    @Inject('LOGGER_CONFIG') protected options: IFlashMEMOLoggerOptions
  ) {
    super();
  }
}
