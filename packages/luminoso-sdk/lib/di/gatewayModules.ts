import { NetworkClient } from "../network/NetworkClient";
import { VariationGateway, UserGateway } from "../gateways";

const user = (client: NetworkClient) => new UserGateway(client);
const variation = (client: NetworkClient) => new VariationGateway(client);

export default {
  user,
  variation,
};
