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

import { ErrorHandler } from "../errors";
import { LogHandler } from "./LogHandler";
import { LogLevel } from "./LogLevel";

export interface LoggerFacade {
  logLevel: LogLevel;
  logHandler: LogHandler | undefined;
  errorHandler: ErrorHandler;

  log(level: LogLevel | string, message: string): void;

  info(message: string | Error, ...splat: any[]): void;

  debug(message: string | Error, ...splat: any[]): void;

  warn(message: string | Error, ...splat: any[]): void;

  error(message: string | Error, ...splat: any[]): void;
}
