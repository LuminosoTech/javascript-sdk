/**
 * Copyright 2020, Luminoso Tech
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

import { Managed } from "./managed";

export type EventQueueSink<T> = (buffer: T[]) => Promise<any>;

export interface EventQueue<T> extends Managed {
  enqueue(event: T): void;
}

export interface EventQueueFactory<T> {
  createEventQueue(config: { sink: EventQueueSink<T>; flushInterval: number; maxQueueSize: number }): EventQueue<T>;
}
