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

import { getLogger } from "@optimizely/js-sdk-logging";
import { EventQueue, EventQueueSink } from "../@types/queue";

const logger = getLogger("EventProcessor");

class Timer {
  private timeout: number;
  private callback: () => void;
  private timeoutId?: number;

  constructor({ timeout, callback }: { timeout: number; callback: () => void }) {
    this.timeout = Math.max(timeout, 0);
    this.callback = callback;
  }

  start(): void {
    this.timeoutId = setTimeout(this.callback, this.timeout) as any;
  }

  refresh(): void {
    this.stop();
    this.start();
  }

  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId as any);
    }
  }
}

export class DefaultEventQueue<T> implements EventQueue<T> {
  // expose for testing
  public timer: Timer;
  private buffer: T[];
  private maxQueueSize: number;
  private sink: EventQueueSink<T>;
  // batchComparator is called to determine whether two events can be included
  // together in the same batch
  private batchComparator: (eventA: T, eventB: T) => boolean;
  private started: boolean;

  constructor({
    flushInterval,
    maxQueueSize,
    sink,
    batchComparator,
  }: {
    flushInterval: number;
    maxQueueSize: number;
    sink: EventQueueSink<T>;
    batchComparator: (eventA: T, eventB: T) => boolean;
  }) {
    this.buffer = [];
    this.maxQueueSize = Math.max(maxQueueSize, 1);
    this.sink = sink;
    this.batchComparator = batchComparator;
    this.timer = new Timer({
      callback: this.flush.bind(this),
      timeout: flushInterval,
    });
    this.started = false;
  }

  start(): void {
    this.started = true;
    // dont start the timer until the first event is enqueued
  }

  stop(): Promise<T> {
    this.started = false;
    const result = this.sink(this.buffer);
    this.buffer = [];
    this.timer.stop();
    return result;
  }

  enqueue(event: T): void {
    if (!this.started) {
      logger.warn("Queue is stopped, not accepting event");
      return;
    }

    // If new event cannot be included into the current batch, flush so it can
    // be in its own new batch.
    const bufferedEvent: T | undefined = this.buffer[0];
    if (bufferedEvent && !this.batchComparator(bufferedEvent, event)) {
      this.flush();
    }

    // start the timer when the first event is put in
    if (this.buffer.length === 0) {
      this.timer.refresh();
    }
    this.buffer.push(event);

    if (this.buffer.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  flush() {
    this.sink(this.buffer);
    this.buffer = [];
    this.timer.stop();
  }
}
