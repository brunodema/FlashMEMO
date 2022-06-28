import { Inject, Injectable, Type } from '@angular/core';
import { INGXLoggerConfig, NGXLogger, NgxLoggerLevel } from 'ngx-logger';

export interface IFlashMEMOLoggerOptions {
  logLevel: 'DEBUG' | 'TRACE' | 'WARNING' | 'INFORMATION' | 'ERROR';
  provider: 'CONSOLE' | 'API';
}

export interface IFlashMEMOLogger {
  logDebug(...args: unknown[]): void;
  logTrace(...args: unknown[]): void;
  logError(...args: unknown[]): void;
  logInformation(...args: unknown[]): void;
  logWarning(...args: unknown[]): void;
}

export class LoggerConfigFactory {
  public BuildConfig(
    internalConfig: IFlashMEMOLoggerOptions,
    configType: 'NGX_LOGGER'
  ): any {
    switch (configType) {
      case 'NGX_LOGGER':
        let logLevel: NgxLoggerLevel;
        switch (internalConfig.logLevel) {
          case 'DEBUG':
            logLevel = NgxLoggerLevel.DEBUG;
            break;
          case 'TRACE':
            logLevel = NgxLoggerLevel.TRACE;

            break;
          case 'INFORMATION':
            logLevel = NgxLoggerLevel.INFO;

            break;
          case 'WARNING':
            logLevel = NgxLoggerLevel.WARN;

            break;
          case 'ERROR':
            logLevel = NgxLoggerLevel.ERROR;

            break;

          default:
            throw new Error('Invalid config level chosen.');
        }

        return {
          level: logLevel,
          serverLogLevel: logLevel,
        } as INGXLoggerConfig;

      default:
        throw new Error('Invalid logger provider chosen.');
    }
  }
}

export abstract class GenericLoggerService implements IFlashMEMOLogger {
  constructor(
    protected loggerInstance: NGXLogger,
    @Inject('LOGGER_CONFIG') protected config: IFlashMEMOLoggerOptions
  ) {
    this.loggerInstance.updateConfig(
      new LoggerConfigFactory().BuildConfig(config, 'NGX_LOGGER')
    );
  }

  logInformation(...args: unknown[]): void {
    this.loggerInstance.info(...args);
  }
  logDebug(...args: unknown[]): void {
    this.loggerInstance.debug(...args);
  }
  logTrace(...args: unknown[]): void {
    this.loggerInstance.trace(...args);
  }
  logError(...args: unknown[]): void {
    this.loggerInstance.error(...args);
  }
  logWarning(...args: unknown[]): void {
    this.loggerInstance.warn(...args);
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService extends GenericLoggerService {
  constructor(
    protected loggerInstance: NGXLogger,
    @Inject('LOGGER_CONFIG') protected config: IFlashMEMOLoggerOptions
  ) {
    super(loggerInstance, config);
  }
}
