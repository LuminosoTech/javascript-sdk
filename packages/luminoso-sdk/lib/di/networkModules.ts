import { NetworkClient } from "../network/NetworkClient";

const networkClient = (clientKey: string) => new NetworkClient(clientKey);

export const networkModule = {
  networkClient,
};
