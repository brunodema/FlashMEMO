import { Inject, Injectable, Type } from '@angular/core';
import {
  INGXLoggerConfig,
  INGXLoggerMetadata,
  NGXLogger,
  NgxLoggerLevel,
  NGXLoggerServerService,
} from 'ngx-logger';
import { IServerLoggingRequest } from '../../models/http/http-request-types';

export interface IFlashMEMOLoggerOptions {
  logLevel: 'DEBUG' | 'TRACE' | 'WARNING' | 'INFORMATION' | 'ERROR';
  serverLogLevel: 'DEBUG' | 'TRACE' | 'WARNING' | 'INFORMATION' | 'ERROR';
  sinks: Array<'CONSOLE' | 'API'>;
  logServerURL: string | undefined;
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

        let serverLogLevel: NgxLoggerLevel;
        switch (internalConfig.serverLogLevel) {
          case 'DEBUG':
            serverLogLevel = NgxLoggerLevel.DEBUG;
            break;
          case 'TRACE':
            serverLogLevel = NgxLoggerLevel.TRACE;

            break;
          case 'INFORMATION':
            serverLogLevel = NgxLoggerLevel.INFO;

            break;
          case 'WARNING':
            serverLogLevel = NgxLoggerLevel.WARN;

            break;
          case 'ERROR':
            serverLogLevel = NgxLoggerLevel.ERROR;

            break;

          default:
            throw new Error('Invalid server config level chosen.');
        }

        return {
          level: logLevel,
          serverLogLevel: serverLogLevel,
          serverLoggingUrl: internalConfig.sinks.includes('API')
            ? `${internalConfig.logServerURL}/api/v1/logging/relay`
            : '',
          disableConsoleLogging: internalConfig.sinks.includes('CONSOLE')
            ? false
            : true,
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

  logInformation(message: any, ...args: unknown[]): void {
    this.loggerInstance.info(message, ...args);
  }
  logDebug(message: any, ...args: unknown[]): void {
    this.loggerInstance.debug(message, ...args);
  }
  logTrace(message: any, ...args: unknown[]): void {
    this.loggerInstance.trace(message, ...args);
  }
  logError(message: any, ...args: unknown[]): void {
    this.loggerInstance.error(message, ...args);
  }
  logWarning(message: any, ...args: unknown[]): void {
    this.loggerInstance.warn(message, ...args);
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

function convertLoggingLevelToNET(level: NgxLoggerLevel): number {
  // Only includes cases where the codes do not match, default cases just forwards the original value
  switch (level) {
    case NgxLoggerLevel.WARN:
      return 3;
    case NgxLoggerLevel.ERROR:
      return 4;
    case NgxLoggerLevel.FATAL:
      return 5;
    case NgxLoggerLevel.OFF:
      return 6;
    default:
      return level;
  }
}

// Implementation taken from here: https://github.com/dbfannin/ngx-logger/blob/master/docs/customising.md#example-adds-a-property-to-the-server-log
@Injectable()
export class ServerCustomisedService extends NGXLoggerServerService {
  public customiseRequestBody(metadata: INGXLoggerMetadata): any {
    return {
      logLevel: convertLoggingLevelToNET(metadata.level),
      message: metadata.message,
      fileName: metadata.fileName,
      columnNumber: metadata.columnNumber,
      lineNumber: metadata.lineNumber,
      timestamp: metadata.timestamp,
      args: metadata.additional,
    } as IServerLoggingRequest;
  }
}
