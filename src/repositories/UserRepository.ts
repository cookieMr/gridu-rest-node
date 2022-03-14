import { Knex } from 'knex';
import { User } from '../models/User';
import { knexConnection } from './KnexInit';
import { Log } from '../utils/Logger';

export class UserRepository {
  private static readonly tableName = 'users';

  constructor(
    private readonly knex: Knex = knexConnection
  ) {
  }

  @Log()
  public async getAll(): Promise<User[]> {
    return this.knex(UserRepository.tableName)
      .select()
      .from(UserRepository.tableName)
      .orderBy('ID')
      .then((records): User[] => records.map<User>(this.mapRecordToUser));
  }

  @Log()
  public async getById(id: string): Promise<User[]> {
    return this.knex(UserRepository.tableName)
      .select()
      .from(UserRepository.tableName)
      .where('ID', id)
      .then((records): User[] => records.map(this.mapRecordToUser));
  }

  @Log()
  public async getByUserName(username: string): Promise<User[]> {
    return this.knex(UserRepository.tableName)
      .select()
      .from(UserRepository.tableName)
      .where('USER_NAME', username)
      .then((records): User[] => records.map(this.mapRecordToUser));
  }

  @Log()
  public async save(user: User): Promise<User> {
    await this.knex(UserRepository.tableName)
      .insert(this.mapUserToRecord(user))
      .into(UserRepository.tableName)
      .then((record) => {
        user.id = `${record.pop()}`;
      });

    return user;
  }

  private readonly mapRecordToUser = (record: Record<string, string>): User => ({
    id: record.ID,
    username: record.USER_NAME
  } as User);

  private readonly mapUserToRecord = (user: User): { [key: string]: string } => ({
    ID: user.id,
    USER_NAME: user.username
  });
}
