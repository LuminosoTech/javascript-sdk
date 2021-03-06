import { AbortableRequest, Headers } from "../@types/http";
import { getBaseUrl } from "../config";
import { ClientUserBody } from "../models/user/body/ClientUserBody";
import { makePostRequest } from "../request/BrowserRequest";

export class NetworkClient {
  private BASE_URL: string;

  private headers: Headers;

  constructor(clientKey: string) {
    this.headers = {
      "X-Luminoso-Sdk-Key": `Bearer ${clientKey}`,
    };

    this.BASE_URL = getBaseUrl();
  }

  public postUser(body: ClientUserBody): AbortableRequest {
    console.log("ClientUserBody", body);

    return makePostRequest(`${this.BASE_URL}/client/user`, this.headers, body);
  }
}
