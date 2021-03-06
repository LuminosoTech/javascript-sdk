import { ClientUserBody } from "../models/user/body/ClientUserBody";
import { UserRepository } from "../repository/UserRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public postClientUser = (body: ClientUserBody) => {
    this.userRepository.postClientUser(body);
  };
}
