import { getBaseUrl } from "../config";
import { makePostRequest } from "../request/BrowserRequest";

export class NetworkClient {
  private BASE_URL: string;

  constructor() {
    this.BASE_URL = getBaseUrl();
  }

  public postUser() {
    makePostRequest("/client/user", {});
  }
}
