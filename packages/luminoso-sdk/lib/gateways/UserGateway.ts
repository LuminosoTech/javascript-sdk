import { ClientUserBody } from "../models/user/body/ClientUserBody";
import { NetworkClient } from "../network/NetworkClient";

export class UserGateway {
  private network: NetworkClient;

  constructor(network: NetworkClient) {
    this.network = network;
  }

  public postClientUser = (body: ClientUserBody) => {
    this.network.postUser(body);
  };
}
