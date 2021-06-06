import { ClientUserBody } from "../models/user/body/ClientUserBody";
import { UserGateway } from "../gateways/UserGateway";

export class UserService {
  private userGateway: UserGateway;

  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  public postClientUser = (body: ClientUserBody) => {
    this.userGateway.postClientUser(body);
  };
}
