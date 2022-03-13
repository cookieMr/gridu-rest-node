import { Exercise } from '../models/Exercise';
import { ExerciseRepository } from '../repositories/ExerciseRepository';
import { Log } from '../utils/Logger';
import { Validation } from '../utils/Validation';

export class ExerciseService {
  private static readonly isoDateRegexp = new RegExp('^\\d{4}-([0]\\d|1[0-2])-([0-2]\\d|3[01])$');

  constructor(
    private readonly repository: ExerciseRepository = new ExerciseRepository()
  ) {
  }

  @Log()
  public async getCountByUserId(userId: string): Promise<number> {
    const result = await this.repository.getCountByUserId(userId);
    return result.pop() || 0;
  }

  @Log()
  public async getAllByUserId(userId: string): Promise<Exercise[]> {
    return this.repository.getByUserId(userId);
  }

  @Log()
  public async getByUserIdPaging(
    userId: string,
    from: string | undefined,
    to: string | undefined,
    limit: string | undefined
  ): Promise<Exercise[]> {
    const nrFrom = Validation.isValidDate(from);
    const nrTo = Validation.isValidDate(to);
    const nrLimit = Validation.isValidLimit(limit);

    return this.repository.getByUserIdPaging(userId, nrFrom, nrTo, nrLimit);
  }

  @Log()
  public async createExercise(exercise: Exercise): Promise<Exercise> {
    if (!exercise || !exercise.userId || !exercise.description || !exercise.duration) {
      throw new Error('Exercise needs to have userId, description and duration properties!');
    }

    if (!exercise.date) {
      exercise.date = new Date().toISOString().slice(0, 10);
    } else if (!ExerciseService.isoDateRegexp.test(exercise.date)) {
      throw new Error('Exercise date needs to be a valid ISO Date (YYYY-MM-DD).')
    }

    return this.repository.save(exercise);
  }
}
