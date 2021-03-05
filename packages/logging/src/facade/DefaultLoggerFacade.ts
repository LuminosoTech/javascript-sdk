/**
 * Copyright 2021, Luminoso Tech
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and* limitations under the License.
 *
 */

import { printf } from "@luminoso/js-sdk-utils";

import { GlobalLoggingConfig } from "../config/GlobalLoggingConfig";
import { NoopErrorHandler } from "../errors";
import { ErrorHandler } from "../errors/ErrorHandler";
import { ConsoleLogHandler } from "../log-handler";
import { LoggerFacade, LogHandler, LogLevel } from "../models";

interface DefaultLoggerConfig {
  logLevel?: LogLevel;
  logHandler?: LogHandler;
}

interface LogData {
  message: string;
  splat: any[];
  error?: Error;
}

export class DefaultLoggerFacade implements LoggerFacade {
  private _logLevel: LogLevel = LogLevel.DEBUG;
  private _logHandler: LogHandler | undefined = new ConsoleLogHandler();
  private _errorHandler: ErrorHandler = new NoopErrorHandler();

  constructor(config?: DefaultLoggerConfig) {
    if (config) {
      if (config.logLevel) {
        this._logLevel = config.logLevel;
      }

      this._logHandler = config.logHandler;
    }
  }

  log(level: LogLevel, message: string): void {
    this.internalLog(level, {
      message,
      splat: [],
    });
  }

  info(message: string | Error, ...splat: any[]): void {
    this.namedLog(LogLevel.INFO, message, splat);
  }
  debug(message: string | Error, ...splat: any[]): void {
    this.namedLog(LogLevel.DEBUG, message, splat);
  }
  warn(message: string | Error, ...splat: any[]): void {
    this.namedLog(LogLevel.WARN, message, splat);
  }
  error(message: string | Error, ...splat: any[]): void {
    this.namedLog(LogLevel.ERROR, message, splat);
  }

  private namedLog(level: LogLevel, message: string | Error, splat: any[]): void {
    let error: Error | undefined;

    if (message instanceof Error) {
      error = message;
      this.internalLog(level, {
        error,
        message: error.message,
        splat,
      });
      return;
    }

    if (splat.length === 0) {
      this.internalLog(level, {
        message,
        splat,
      });
      return;
    }

    const last = splat[splat.length - 1];
    if (last instanceof Error) {
      error = last;
      splat.splice(-1);
    }

    this.internalLog(level, { message, error, splat });
  }

  get logLevel(): LogLevel {
    return this._logLevel;
  }

  get logHandler(): LogHandler | undefined {
    return this._logHandler;
  }

  get errorHandler(): ErrorHandler {
    return this._errorHandler;
  }

  set logLevel(level: LogLevel) {
    this._logLevel = level;
  }

  set logHandler(handler: LogHandler | undefined) {
    this._logHandler = handler;
  }

  set errorHandler(handler: ErrorHandler) {
    this._errorHandler = handler;
  }

  private format(data: LogData): string {
    return `${printf(data.message, ...data.splat)}`;
  }

  private internalLog(level: LogLevel, data: LogData): void {
    if (!this.logHandler) {
      return;
    }

    if (level < this.logLevel) {
      return;
    }

    this.logHandler.log(level, this.format(data));

    if (data.error && data.error instanceof Error) {
      this._errorHandler.handleError(data.error);
    }
  }
}
