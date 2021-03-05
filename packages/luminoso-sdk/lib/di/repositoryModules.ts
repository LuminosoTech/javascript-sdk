import { NetworkClient } from "../network/NetworkClient";
import { VariationRepository } from "../repository";
import { UserRepository } from "../repository/UserRepository";

const user = (client: NetworkClient) => new UserRepository(client);
const variation = (client: NetworkClient) => new VariationRepository(client);

export const repositoryModule = {
  user,
  variation,
};
