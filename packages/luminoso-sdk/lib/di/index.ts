import { VariationService, UserService } from "../services";
import { serviceModule } from "./serviceModules";
import { networkModule } from "./networkModules";
import { repositoryModule } from "./repositoryModules";

export class Di {
  private static _instance: Di | undefined = undefined;

  private readonly _userService: UserService;
  private readonly _variationService: VariationService;

  constructor() {
    const networkClient = networkModule.networkClient();

    const userRepository = repositoryModule.user(networkClient);
    const variationRepository = repositoryModule.variation(networkClient);

    this._userService = serviceModule.user(userRepository);
    this._variationService = serviceModule.variation(variationRepository);
  }

  public static instance = () => {
    if (Di._instance === undefined) {
      Di._instance = new Di();
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
