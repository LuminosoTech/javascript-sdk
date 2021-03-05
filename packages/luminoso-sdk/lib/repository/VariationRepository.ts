import { NetworkClient } from "../network/NetworkClient";

export class VariationRepository {
  private network: NetworkClient;

  constructor(network: NetworkClient) {
    this.network = network;
  }
}
