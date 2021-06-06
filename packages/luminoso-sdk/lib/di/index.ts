import { VariationService, UserService } from "../services";
import { serviceModule } from "./serviceModules";
import { networkModule } from "./networkModules";
import gatewayModule from "./gatewayModules";

export class Di {
  private static _instance: Di | undefined = undefined;

  private readonly _userService: UserService;
  private readonly _variationService: VariationService;

  constructor(clientKey: string) {
    const networkClient = networkModule.networkClient(clientKey);

    const UserGateway = gatewayModule.user(networkClient);
    const variationGateway = gatewayModule.variation(networkClient);

    this._userService = serviceModule.user(UserGateway);
    this._variationService = serviceModule.variation(variationGateway);
  }

  public static instance = (clientKey: string) => {
    if (Di._instance === undefined) {
      Di._instance = new Di(clientKey);
    }
    return Di._instance;
  };

  public get userService() {
    return this._userService;
  }

  public get variationService() {
    return this._variationService;
  }
}
