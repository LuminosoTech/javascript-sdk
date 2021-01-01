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

import chalk from "chalk";
import { LogHandler, LogLevel } from "../models";

interface ConsoleLogHandlerConfig {
  logLevel?: LogLevel | string;
  logToConsole?: boolean;
  logPrefix?: string;
}

export class ConsoleLogHandler implements LogHandler {
  private _logLevel: LogLevel = LogLevel.NOTSET;
  private _logToConsole: boolean;
  private _logPrefix: string = `${new Date().toISOString()} ${this.getLogLevel(this._logLevel)} [ Luminoso ]`;

  constructor(config?: ConsoleLogHandlerConfig) {
    if (config && config.logPrefix) {
      this._logPrefix = config.logPrefix;
    }
    this._logToConsole = config?.logToConsole ? config?.logToConsole : true;
  }

  log(level: LogLevel, message: string): void {
    if (!this._logToConsole || !this.shouldLog(level)) {
      return;
    }

    let logMessage: string = `${this._logPrefix} - ${message}`;

    this.consoleLog(level, [logMessage]);
  }

  get logLevel(): LogLevel {
    return this._logLevel;
  }

  private getLogLevel(logLevel: LogLevel): string {
    switch (logLevel) {
      case LogLevel.DEBUG:
        return chalk.green("DEBUG");
      case LogLevel.INFO:
        return chalk.blue("INFO");
      case LogLevel.WARN:
        return chalk.yellow("WARN");
      case LogLevel.ERROR:
        return chalk.red("ERROR");
      default:
        return chalk.gray("NOTSET");
    }
  }

  private shouldLog(targetLogLevel: LogLevel): boolean {
    return targetLogLevel >= this.logLevel;
  }

  private consoleLog(logLevel: LogLevel, logArguments: [string, ...string[]]) {
    switch (logLevel) {
      case LogLevel.DEBUG:
        console.log.apply(console, logArguments);
        break;
      case LogLevel.INFO:
        console.info.apply(console, logArguments);
        break;
      case LogLevel.WARN:
        console.warn.apply(console, logArguments);
        break;
      case LogLevel.ERROR:
        console.error.apply(console, logArguments);
        break;
      default:
        console.log.apply(console, logArguments);
    }
  }
}
