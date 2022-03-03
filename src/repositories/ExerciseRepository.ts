import { Knex } from 'knex';
import { knexConnection } from './KnexInit';
import { Exercise } from '../models/Exercise';
import { Log } from '../utils/Logger';

export class ExerciseRepository {
  private static readonly tableName = 'exercises';

  constructor(
    private readonly knex: Knex = knexConnection
  ) {
  }

  @Log()
  public getByUserId(userId: string): Promise<Exercise[]> {
    return this.knex(ExerciseRepository.tableName)
      .select()
      .from(ExerciseRepository.tableName)
      .where('USER_ID', userId)
      .then((records): Exercise[] => {
        return records.map(this.mapRecordToExercise) as Exercise[];
      });
  }

  @Log()
  public async save(exercise: Exercise): Promise<Exercise> {
    await this.knex(ExerciseRepository.tableName)
      .insert(this.mapExerciseToRecord(exercise))
      .into(ExerciseRepository.tableName)
      .then((record) => {
        exercise.id = `${record.pop()}`;
      });

    return exercise;
  }

  private readonly mapRecordToExercise = (record: Record<string, string>): Exercise => ({
    id: record.ID,
    userId: record.USER_NAME,
    description: record._DESCRIPTION,
    duration: record.DURATION,
    date: record._DATE
  } as Exercise);

  private readonly mapExerciseToRecord = (exercise: Exercise): { [key: string]: string } => ({
    'ID': exercise.id,
    'USER_ID': exercise.userId,
    '_DESCRIPTION': exercise.description,
    'DURATION': exercise.duration,
    '_DATE': exercise.date
  });
}
