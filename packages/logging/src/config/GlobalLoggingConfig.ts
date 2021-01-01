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

import { NoopErrorHandler } from "../errorHandler";
import { ErrorHandler } from "../errors/ErrorHandler";
import { LogHandler, LogLevel } from "../models";

export class GlobalLoggingConfig {
  private _logLevel: LogLevel = LogLevel.NOTSET;
  private _logHandler: LogHandler | undefined = undefined;
  private _errorHandler: ErrorHandler = new NoopErrorHandler();

  private static _instance: GlobalLoggingConfig | undefined = undefined;

  get level(): LogLevel {
    return this._logLevel;
  }

  set level(level: LogLevel) {
    this._logLevel = level;
  }

  get logHandler(): LogHandler | undefined {
    return this._logHandler;
  }

  set logHandler(handler: LogHandler | undefined) {
    this._logHandler = handler;
  }

  get errorHandler(): ErrorHandler {
    return this._errorHandler;
  }

  set errorHandler(handler: ErrorHandler) {
    this._errorHandler = handler;
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new GlobalLoggingConfig();
    }

    return this._instance;
  }
}
