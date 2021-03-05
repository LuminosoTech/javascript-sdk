/**
 * Headers is the interface that bridges between the abstract datafile manager and
 * any Node-or-browser-specific http header types.
 * It's simplified and can only store one value per header name.
 * We can extend or replace this type if requirements change and we need
 * to work with multiple values per header name.
 */
export interface Headers {
  [header: string]: string | undefined;
}

export interface Response {
  statusCode?: number;
  body: string;
  headers: Headers;
}

export interface AbortableRequest {
  abort(): void;
  responsePromise: Promise<Response>;
}
