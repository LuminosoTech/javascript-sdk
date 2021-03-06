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
/// <reference types="jest" />

import { LogEventProcessor } from "../src/event/LogEventProcessor";
import { EventDispatcher, EventRequest, EventDispatcherCallback } from "../src/@types/eventDispatcher";
import { EventProcessor } from "../src/eventProcessor";
import { NotificationCenter, NOTIFICATION_TYPES } from "@optimizely/js-sdk-utils";
import { buildImpressionEvent, ImpressionEvent, makeBatchedEvent } from "../src";

function createImpressionEvent(): ImpressionEvent {
  return {
    type: "impression" as "impression",
    timestamp: 69,
    uuid: "uuid",

    context: {
      accountId: "accountId",
      projectId: "projectId",
      clientName: "node-sdk",
      clientVersion: "3.0.0",
      revision: "1",
      anonymizeIP: true,
    },

    user: {
      id: "userId",
    },

    experiment: {
      id: "expId",
      key: "expKey",
    },

    variation: {
      id: "varId",
      key: "varKey",
    },

    ruleKey: "expKey",
    featureKey: "flagKey1",
    enabled: true,
  };
}

function createConversionEvent() {
  return {
    type: "conversion" as "conversion",
    timestamp: 69,
    uuid: "uuid",

    context: {
      accountId: "accountId",
      projectId: "projectId",
      clientName: "node-sdk",
      clientVersion: "3.0.0",
      revision: "1",
      botFiltering: true,
      anonymizeIP: true,
    },

    user: {
      id: "userId",
      attributes: [{ entityId: "attr1-id", key: "attr1-key", value: "attr1-value" }],
    },

    event: {
      id: "event-id",
      key: "event-key",
    },

    tags: {
      foo: "bar",
      value: "123",
      revenue: "1000",
    },

    revenue: 1000,
    value: 123,
  };
}

describe("LogEventProcessor", () => {
  let stubDispatcher: EventDispatcher;
  let dispatchStub: jest.Mock;
  // TODO change this to ProjectConfig when js-sdk-models is available
  let testProjectConfig: any;

  beforeEach(() => {
    jest.useFakeTimers();

    testProjectConfig = {};
    dispatchStub = jest.fn();

    stubDispatcher = {
      dispatchEvent(event: EventRequest, callback: EventDispatcherCallback): void {
        dispatchStub(event);
        callback({ statusCode: 200 });
      },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("stop()", () => {
    let localCallback: EventDispatcherCallback;
    beforeEach(() => {
      stubDispatcher = {
        dispatchEvent(event: EventRequest, callback: EventDispatcherCallback): void {
          dispatchStub(event);
          localCallback = callback;
        },
      };
    });

    it("should return a resolved promise when there is nothing in queue", (done) => {
      const processor = new LogEventProcessor({
        dispatcher: stubDispatcher,
        flushInterval: 100,
        batchSize: 100,
      });

      processor.stop().then(() => {
        done();
      });
    });

    it("should return a promise that is resolved when the dispatcher callback returns a 200 response", (done) => {
      const processor = new LogEventProcessor({
        dispatcher: stubDispatcher,
        flushInterval: 100,
        batchSize: 100,
      });
      processor.start();

      const impressionEvent = createImpressionEvent();
      processor.process(impressionEvent);

      processor.stop().then(() => {
        done();
      });

      localCallback({ statusCode: 200 });
    });

    it("should return a promise that is resolved when the dispatcher callback returns a 400 response", (done) => {
      // This test is saying that even if the request fails to send but
      // the `dispatcher` yielded control back, then the `.stop()` promise should be resolved
      let localCallback: any;
      stubDispatcher = {
        dispatchEvent(event: EventRequest, callback: EventDispatcherCallback): void {
          dispatchStub(event);
          localCallback = callback;
        },
      };

      const processor = new LogEventProcessor({
        dispatcher: stubDispatcher,
        flushInterval: 100,
        batchSize: 100,
      });
      processor.start();

      const impressionEvent = createImpressionEvent();
      processor.process(impressionEvent);

      processor.stop().then(() => {
        done();
      });

      localCallback({
        statusCode: 400,
      });
    });

    it("should return a promise when multiple event batches are sent", (done) => {
      stubDispatcher = {
        dispatchEvent(event: EventRequest, callback: EventDispatcherCallback): void {
          dispatchStub(event);
          callback({ statusCode: 200 });
        },
      };

      const processor = new LogEventProcessor({
        dispatcher: stubDispatcher,
        flushInterval: 100,
        batchSize: 100,
      });
      processor.start();

      const impressionEvent1 = createImpressionEvent();
      const impressionEvent2 = createImpressionEvent();
      impressionEvent2.context.revision = "2";
      processor.process(impressionEvent1);
      processor.process(impressionEvent2);

      processor.stop().then(() => {
        expect(dispatchStub).toBeCalledTimes(2);
        done();
      });
    });

    it("should stop accepting events after stop is called", () => {
      const dispatcher = {
        dispatchEvent: jest.fn((event: EventRequest, callback: EventDispatcherCallback) => {
          setTimeout(() => callback({ statusCode: 204 }), 0);
        }),
      };
      const processor = new LogEventProcessor({
        dispatcher,
        flushInterval: 100,
        batchSize: 3,
      });
      processor.start();

      const impressionEvent1 = createImpressionEvent();
      processor.process(impressionEvent1);
      processor.stop();
      // calling stop should haver flushed the current batch of size 1
      expect(dispatcher.dispatchEvent).toBeCalledTimes(1);

      dispatcher.dispatchEvent.mockClear();

      // From now on, subsequent events should be ignored.
      // Process 3 more, which ordinarily would have triggered
      // a flush due to the batch size.
      const impressionEvent2 = createImpressionEvent();
      processor.process(impressionEvent2);
      const impressionEvent3 = createImpressionEvent();
      processor.process(impressionEvent3);
      const impressionEvent4 = createImpressionEvent();
      processor.process(impressionEvent4);
      // Since we already stopped the processor, the dispatcher should
      // not have been called again.
      expect(dispatcher.dispatchEvent).toBeCalledTimes(0);
    });

    it("should resolve the stop promise after all dispatcher requests are done", async () => {
      const dispatchCbs: Array<EventDispatcherCallback> = [];
      const dispatcher = {
        dispatchEvent: jest.fn((event: EventRequest, callback: EventDispatcherCallback) => {
          dispatchCbs.push(callback);
        }),
      };

      const processor = new LogEventProcessor({
        dispatcher,
        flushInterval: 100,
        batchSize: 2,
      });
      processor.start();

      for (let i = 0; i < 4; i++) {
        processor.process(createImpressionEvent());
      }
      expect(dispatchCbs.length).toBe(2);

      let stopPromiseResolved = false;
      const stopPromise = processor.stop().then(() => {
        stopPromiseResolved = true;
      });
      expect(stopPromiseResolved).toBe(false);

      dispatchCbs[0]({ statusCode: 204 });
      jest.advanceTimersByTime(100);
      expect(stopPromiseResolved).toBe(false);
      dispatchCbs[1]({ statusCode: 204 });
      await stopPromise;
      expect(stopPromiseResolved).toBe(true);
    });
  });

  describe("when batchSize = 1", () => {
    let processor: EventProcessor;
    beforeEach(() => {
      processor = new LogEventProcessor({
        dispatcher: stubDispatcher,
        flushInterval: 100,
        batchSize: 1,
      });
      processor.start();
    });

    afterEach(() => {
      processor.stop();
    });

    it("should immediately flush events as they are processed", () => {
      const impressionEvent = createImpressionEvent();
      processor.process(impressionEvent);

      expect(dispatchStub).toHaveBeenCalledTimes(1);
      expect(dispatchStub).toHaveBeenCalledWith({
        url: "https://events.luminoso.tech/events",
        httpVerb: "POST",
        params: buildImpressionEvent(impressionEvent),
      });
    });
  });

  describe("when batchSize = 3, flushInterval = 100", () => {
    let processor: EventProcessor;
    beforeEach(() => {
      processor = new LogEventProcessor({
        dispatcher: stubDispatcher,
        flushInterval: 100,
        batchSize: 3,
      });
      processor.start();
    });

    afterEach(() => {
      processor.stop();
    });

    it("should wait until 3 events to be in the queue before it flushes", () => {
      const impressionEvent1 = createImpressionEvent();
      const impressionEvent2 = createImpressionEvent();
      const impressionEvent3 = createImpressionEvent();

      processor.process(impressionEvent1);
      processor.process(impressionEvent2);

      expect(dispatchStub).toHaveBeenCalledTimes(0);

      processor.process(impressionEvent3);

      expect(dispatchStub).toHaveBeenCalledTimes(1);
      expect(dispatchStub).toHaveBeenCalledWith({
        url: "https://events.luminoso.tech/events",
        httpVerb: "POST",
        params: makeBatchedEvent([impressionEvent1, impressionEvent2, impressionEvent3]),
      });
    });

    it("should flush the current batch when it receives an event with a different context revision than the current batch", async () => {
      const impressionEvent1 = createImpressionEvent();
      const conversionEvent = createConversionEvent();
      const impressionEvent2 = createImpressionEvent();

      // createImpressionEvent and createConversionEvent create events with revision '1'
      // We modify this one's revision to '2' in order to test that the queue is flushed
      // when an event with a different revision is processed.
      impressionEvent2.context.revision = "2";

      processor.process(impressionEvent1);
      processor.process(conversionEvent);

      expect(dispatchStub).toHaveBeenCalledTimes(0);

      processor.process(impressionEvent2);

      expect(dispatchStub).toHaveBeenCalledTimes(1);
      expect(dispatchStub).toHaveBeenCalledWith({
        url: "https://events.luminoso.tech/events",
        httpVerb: "POST",
        params: makeBatchedEvent([impressionEvent1, conversionEvent]),
      });

      await processor.stop();

      expect(dispatchStub).toHaveBeenCalledTimes(2);

      expect(dispatchStub).toHaveBeenCalledWith({
        url: "https://events.luminoso.tech/events",
        httpVerb: "POST",
        params: makeBatchedEvent([impressionEvent2]),
      });
    });

    it("should flush the current batch when it receives an event with a different context projectId than the current batch", async () => {
      const impressionEvent1 = createImpressionEvent();
      const conversionEvent = createConversionEvent();
      const impressionEvent2 = createImpressionEvent();

      impressionEvent2.context.projectId = "projectId2";

      processor.process(impressionEvent1);
      processor.process(conversionEvent);

      expect(dispatchStub).toHaveBeenCalledTimes(0);

      processor.process(impressionEvent2);

      expect(dispatchStub).toHaveBeenCalledTimes(1);
      expect(dispatchStub).toHaveBeenCalledWith({
        url: "https://events.luminoso.tech/events",
        httpVerb: "POST",
        params: makeBatchedEvent([impressionEvent1, conversionEvent]),
      });

      await processor.stop();

      expect(dispatchStub).toHaveBeenCalledTimes(2);

      expect(dispatchStub).toHaveBeenCalledWith({
        url: "https://events.luminoso.tech/events",
        httpVerb: "POST",
        params: makeBatchedEvent([impressionEvent2]),
      });
    });

    it("should flush the queue when the flush interval happens", () => {
      const impressionEvent1 = createImpressionEvent();

      processor.process(impressionEvent1);

      expect(dispatchStub).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(100);

      expect(dispatchStub).toHaveBeenCalledTimes(1);
      expect(dispatchStub).toHaveBeenCalledWith({
        url: "https://events.luminoso.tech/events",
        httpVerb: "POST",
        params: makeBatchedEvent([impressionEvent1]),
      });

      processor.process(createImpressionEvent());
      processor.process(createImpressionEvent());
      // flushing should reset queue, at this point only has two events
      expect(dispatchStub).toHaveBeenCalledTimes(1);
    });
  });

  describe("when a notification center is provided", () => {
    it("should trigger a notification when the event dispatcher dispatches an event", () => {
      const dispatcher: EventDispatcher = {
        dispatchEvent: jest.fn(),
      };

      const notificationCenter: NotificationCenter = {
        sendNotifications: jest.fn(),
      };

      const processor = new LogEventProcessor({
        dispatcher,
        notificationCenter,
        batchSize: 1,
      });
      processor.start();

      const impressionEvent1 = createImpressionEvent();
      processor.process(impressionEvent1);

      expect(notificationCenter.sendNotifications).toBeCalledTimes(1);
      const event = (dispatcher.dispatchEvent as jest.Mock).mock.calls[0][0];
      expect(notificationCenter.sendNotifications).toBeCalledWith(NOTIFICATION_TYPES.LOG_EVENT, event);
    });
  });

  describe("invalid flushInterval or batchSize", () => {
    it("should ignore a flushInterval of 0 and use the default", () => {
      const processor = new LogEventProcessor({
        dispatcher: stubDispatcher,
        flushInterval: 0,
        batchSize: 10,
      });
      processor.start();

      const impressionEvent1 = createImpressionEvent();
      processor.process(impressionEvent1);
      expect(dispatchStub).toHaveBeenCalledTimes(0);
      jest.advanceTimersByTime(30000);
      expect(dispatchStub).toHaveBeenCalledTimes(1);
      expect(dispatchStub).toHaveBeenCalledWith({
        url: "https://events.luminoso.tech/events",
        httpVerb: "POST",
        params: makeBatchedEvent([impressionEvent1]),
      });
    });

    it("should ignore a batchSize of 0 and use the default", () => {
      const processor = new LogEventProcessor({
        dispatcher: stubDispatcher,
        flushInterval: 30000,
        batchSize: 0,
      });
      processor.start();

      const impressionEvent1 = createImpressionEvent();
      processor.process(impressionEvent1);
      expect(dispatchStub).toHaveBeenCalledTimes(0);
      const impressionEvents = [impressionEvent1];
      for (let i = 0; i < 9; i++) {
        const evt = createImpressionEvent();
        processor.process(evt);
        impressionEvents.push(evt);
      }
      expect(dispatchStub).toHaveBeenCalledTimes(1);
      expect(dispatchStub).toHaveBeenCalledWith({
        url: "https://events.luminoso.tech/events",
        httpVerb: "POST",
        params: makeBatchedEvent(impressionEvents),
      });
    });
  });
});
