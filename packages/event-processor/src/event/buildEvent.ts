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

import { ImpressionEvent } from "../@types/events";
import { ProcessableEvent } from "../eventProcessor";
import { EventRequest } from "../@types/eventDispatcher";

export type Event = {
  account_id: string;
  project_id: string;
  revision: string;
  client_name: string;
  client_version: string;
  anonymize_ip: boolean;
};

type Attributes = {
  [key: string]: string | number | boolean;
};

export function makeBatchedEvent(events: ProcessableEvent[]): Event {
  const data = events[0];

  return {
    client_name: data.context.clientName,
    client_version: data.context.clientVersion,
    account_id: data.context.accountId,
    project_id: data.context.projectId,
    revision: data.context.revision,
    anonymize_ip: data.context.anonymizeIP,
  };
}

export function buildImpressionEvent(data: ImpressionEvent): Event {
  return {
    client_name: data.context.clientName,
    client_version: data.context.clientVersion,
    account_id: data.context.accountId,
    project_id: data.context.projectId,
    revision: data.context.revision,
    anonymize_ip: data.context.anonymizeIP,
  };
}

export function formatEvents(events: ProcessableEvent[]): EventRequest {
  return {
    url: "https://events.luminoso.tech/events",
    httpVerb: "POST",
    params: makeBatchedEvent(events),
  };
}
