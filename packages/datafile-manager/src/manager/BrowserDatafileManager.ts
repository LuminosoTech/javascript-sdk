import { makeGetRequest } from "../request/BrowserRequest";
import HttpPollingDatafileManager from "./HttpPollingDatafileManager";
import { Headers, AbortableRequest } from "../@types/http";
import { DatafileManagerConfig } from "../@types/datafileManager";

export default class BrowserDatafileManager extends HttpPollingDatafileManager {
  protected makeGetRequest(reqUrl: string, headers: Headers): AbortableRequest {
    return makeGetRequest(reqUrl, headers);
  }

  protected getConfigDefaults(): Partial<DatafileManagerConfig> {
    return {
      autoUpdate: false,
    };
  }
}
