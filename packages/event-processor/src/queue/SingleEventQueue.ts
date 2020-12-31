import { EventQueue, EventQueueSink } from "../@types/queue";

export class SingleEventQueue<T> implements EventQueue<T> {
  private sink: EventQueueSink<T>;

  constructor({ sink }: { sink: EventQueueSink<T> }) {
    this.sink = sink;
  }

  start(): void {
    // no-op
  }

  stop(): Promise<any> {
    // no-op
    return Promise.resolve();
  }

  enqueue(event: T): void {
    this.sink([event]);
  }
}
