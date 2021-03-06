import { NetworkClient } from "../network/NetworkClient";

export class UserRepository {
  private network: NetworkClient;

  constructor(network: NetworkClient) {
    this.network = network;
  }

  public postClientUser = () => {
    this.network.postUser();
  };
}
