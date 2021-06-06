import { NetworkClient } from "../network/NetworkClient";

export class VariationGateway {
  private network: NetworkClient;

  constructor(network: NetworkClient) {
    this.network = network;
  }
}
