import { UserRepository, VariationRepository } from "../repository";
import { VariationService, UserService } from "../services";

const user = (repository: UserRepository) => new UserService(repository);
const variation = (repository: VariationRepository) => new VariationService(repository);

export const serviceModule = {
  user,
  variation,
};
