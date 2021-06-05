import { ErrorHandler, LogHandler, LogLevel } from "@luminoso/js-sdk-logging";

export { User } from "./models";

export type UserAttributes = {
  [name: string]: any;
};

export interface UserProfile {
  user_id: string;
  experiment_map: {
    [experiment_id: string]: {
      variation_id: string;
    };
  };
}

export interface UserProfileService {
  lookup(userId: string): UserProfile;
  save(profile: UserProfile): void;
}

export interface DatafileOptions {
  autoUpdate?: boolean;
  updateInterval?: number;
  urlTemplate?: string;
  datafileAccessToken?: string;
}

export interface ListenerPayload {
  userId: string;
  attributes?: UserAttributes;
}

export type NotificationListener<T extends ListenerPayload> = (notificationData: T) => void;

// An event to be submitted to Optimizely, enabling tracking the reach and impact of
// tests and feature rollouts.
export interface Event {
  // URL to which to send the HTTP request.
  url: string;
  // HTTP method with which to send the event.
  httpVerb: "POST";
  // Value to send in the request body, JSON-serialized.
  params: any;
}

export interface EventDispatcher {
  /**
   * @param event
   *        Event being submitted for eventual dispatch.
   * @param callback
   *        After the event has at least been queued for dispatch, call this function to return
   *        control back to the Client.
   */
  dispatchEvent: (event: Event, callback: (response: { statusCode: number }) => void) => void;
}

export interface VariationFeature {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export interface Variation {
  id: string;
  key: string;
  features: VariationFeature[];
  updatedAt: Date;
  createdAt: Date;
}

export interface Experiment {
  id: string;
  key: string;
  variations: Variation[];
  variationKeyMap: { [key: string]: Variation };
  updatedAt: Date;
  createdAt: Date;
}

export interface FeatureVariable {
  id: string;
  key: string;
  defaultValue: string;
}

export interface Feature {
  id: string;
  name: string;
  key: string;
  experimentIds: string[];
  variables: FeatureVariable[];
  variableKeyMap: { [key: string]: FeatureVariable };
  updatedAt: Date;
  createdAt: Date;
}

export interface VariationFeatureVariable {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface FeatureMap {
  [key: string]: Feature;
}

export interface OnReadyResult {
  success: boolean;
  reason?: string;
}

export interface LuminosoOptions {
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
export interface SDKOptions {
  // Datafile string
  datafile?: string;
  // errorHandler object for logging error
  errorHandler?: ErrorHandler;
  // limit of events to dispatch in a batch
  eventBatchSize?: number;
  // event dispatcher function
  eventDispatcher?: EventDispatcher;
  // maximum time for an event to stay in the queue
  eventFlushInterval?: number;
  // level of logging i.e debug, info, error, warning etc
  logLevel?: LogLevel | string;
  // LogHandler object for logging
  logger?: LogHandler;
  // sdk key
  sdkKey?: string;
  // user profile that contains user information
  userProfileService?: UserProfileService;
}
