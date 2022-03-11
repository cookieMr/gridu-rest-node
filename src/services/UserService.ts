import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { Log } from '../utils/Logger';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository()
  ) {
  }

  @Log()
  public async getAll(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  @Log()
  public async getById(id: string): Promise<User | undefined> {
    const users = await this.userRepository.getById(id);
    return users.pop();
  }

  @Log()
  public async createUser(user: User): Promise<User> {
    if (!user || !user.username) {
      throw new Error('User needs to have a name!');
    }

    const sameNameUsers = await this.userRepository.getByUserName(user.username);
    if (sameNameUsers.length !== 0) {
      throw new Error('User with the same name already exists!');
    }

    return this.userRepository.save(user);
  }
}
