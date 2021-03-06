import { Listener } from '@luminoso/datafile-manager/lib/EventEmitter';
import { ErrorHandler, LogLevel, LogHandler } from '@luminoso/js-sdk-logging';

interface UserProfile {
    user_id: string;
    experiment_map: {
        [experiment_id: string]: {
            variation_id: string;
        };
    };
}
interface UserProfileService {
    lookup(userId: string): UserProfile;
    save(profile: UserProfile): void;
}
interface DatafileOptions {
    autoUpdate?: boolean;
    updateInterval?: number;
    urlTemplate?: string;
    datafileAccessToken?: string;
}
interface Event {
    url: string;
    httpVerb: "POST";
    params: any;
}
interface EventDispatcher {
    /**
     * @param event
     *        Event being submitted for eventual dispatch.
     * @param callback
     *        After the event has at least been queued for dispatch, call this function to return
     *        control back to the Client.
     */
    dispatchEvent: (event: Event, callback: (response: {
        statusCode: number;
    }) => void) => void;
}
interface LuminosoOptions {
    clientEngine: string;
    clientVersion?: string;
    datafile?: string;
    datafileOptions?: DatafileOptions;
    errorHandler: ErrorHandler;
    eventBatchSize?: number;
    eventDispatcher: EventDispatcher;
    eventFlushInterval?: number;
    eventMaxQueueSize?: number;
    jsonSchemaValidator?: object;
    logger: LogHandler;
    sdkKey?: string;
    userProfileService?: UserProfileService | null;
}
/**
 * Entry level Config Entities
 */
interface SDKOptions {
    datafile?: string;
    errorHandler?: ErrorHandler;
    eventBatchSize?: number;
    eventDispatcher?: EventDispatcher;
    eventFlushInterval?: number;
    logLevel?: LogLevel | string;
    logger?: LogHandler;
    sdkKey?: string;
    userProfileService?: UserProfileService;
}

declare class LuminosoInstance {
    private di;
    private manager;
    private listeners;
    constructor(options: Partial<LuminosoOptions>);
    get datafile(): string;
    variation(key: string): string;
    track(event: string): void;
    on(eventName: string, listener: Listener): void;
}

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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

declare const createInstance: (config: SDKOptions) => LuminosoInstance;

export { createInstance };
