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

export interface BaseEvent {
  type: "impression" | "conversion";
  timestamp: number;
  uuid: string;

  // projectConfig stuff
  context: {
    accountId: string;
    projectId: string;
    clientName: string;
    clientVersion: string;
    revision: string;
    anonymizeIP: boolean;
  };
}

export interface ImpressionEvent extends BaseEvent {
  type: "impression";

  user: {
    id: string;
  };

  experiment: {
    id: string | null;
    key: string;
  } | null;

  variation: {
    id: string | null;
    key: string;
  } | null;

  ruleKey: string;
  featureKey: string;
  enabled: boolean;
}

export interface ConversionEvent extends BaseEvent {
  type: "conversion";
  user: {
    id: string;
  };

  event: {
    id: string;
    key: string;
  };

  value: number | null;
}

export function areEventContextsEqual(eventA: BaseEvent, eventB: BaseEvent): boolean {
  const contextA = eventA.context;
  const contextB = eventB.context;
  return (
    contextA.accountId === contextB.accountId &&
    contextA.projectId === contextB.projectId &&
    contextA.clientName === contextB.clientName &&
    contextA.clientVersion === contextB.clientVersion &&
    contextA.revision === contextB.revision &&
    contextA.anonymizeIP === contextB.anonymizeIP
  );
}
