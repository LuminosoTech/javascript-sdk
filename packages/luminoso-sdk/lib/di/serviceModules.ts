import { UserGateway, VariationGateway } from "../gateways";
import { VariationService, UserService } from "../services";

const user = (gateway: UserGateway) => new UserService(gateway);
const variation = (gateway: VariationGateway) => new VariationService(gateway);

export const serviceModule = {
  user,
  variation,
};
