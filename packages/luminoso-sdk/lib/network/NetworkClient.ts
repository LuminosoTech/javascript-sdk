import { AbortableRequest, Headers } from "../@types/http";
import { getBaseUrl } from "../config";
import { makePostRequest } from "../request/BrowserRequest";

export class NetworkClient {
  private clientKey: string;
  private BASE_URL: string;

  private headers: Headers;

  constructor(clientKey: string) {
    this.clientKey = clientKey;

    this.headers = {
      Authorization: `X-CLIENT-KEY ${clientKey}`,
    };

    this.BASE_URL = getBaseUrl();
  }

  public postUser(): AbortableRequest {
    return makePostRequest("/client/user", this.headers);
  }
}
