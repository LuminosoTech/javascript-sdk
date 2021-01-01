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

import { LogManager, LoggerFacade } from "../models";
import { DefaultLoggerFacade } from "../facade/DefaultLoggerFacade";

const defaultLogger = new DefaultLoggerFacade();

export class DefaultLogManager implements LogManager {
  private loggers: { [key: string]: LoggerFacade } = {};
  private static _instance: DefaultLogManager;

  getLogger(name?: string): LoggerFacade {
    if (!name) {
      return defaultLogger;
    }

    if (!(name in this.loggers)) {
      this.loggers[name] = new DefaultLoggerFacade();
    }

    return this.loggers[name];
  }

  static get instance(): DefaultLogManager {
    if (!this._instance) {
      this._instance = new DefaultLogManager();
    }
    return this._instance;
  }
}
