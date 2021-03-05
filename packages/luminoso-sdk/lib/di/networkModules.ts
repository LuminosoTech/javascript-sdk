import { NetworkClient } from "../network/NetworkClient";

const networkClient = () => new NetworkClient();

export const networkModule = {
  networkClient,
};
