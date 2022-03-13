import express, { Express, Router } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../models/User';
import bodyParser from 'body-parser';
import { ExerciseService } from '../services/ExerciseService';
import { Exercise } from '../models/Exercise';

type FromToLimitType = {
  from: string | undefined,
  to: string | undefined,
  limit: string | undefined
};

export class RouterController {
  constructor(
    private readonly port: number = Number(process.env.HTTP_PORT) || 3000,
    private readonly app: Express = express(),
    private readonly router: Router = express.Router(),
    private readonly userService: UserService = new UserService(),
    private readonly exerciseService: ExerciseService = new ExerciseService()
  ) {
    this.router.get('/', this.homePage);
    this.router.get('/api/users', this.getAllUsers);
    this.router.post('/api/users', this.createUser);
    this.router.get('/api/users/:id', this.getUserById);

    this.router.post('/api/users/:id/exercises', this.createExercise);
    this.router.get('/api/users/:id/logs', this.getUserExercises);
    this.router.post('/api/users/:id/logs', this.getUserExercisesLog);

    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use('/', this.router);
  }

  public start(): void {
    this.app.listen(this.port, (): void => {
      console.log(`Listening on port ${this.port}.`);
    });
  }

  private readonly homePage = (request: any, response: any): void => {
    try {
      response.send({ message: 'Hello GridU!' });
    } catch (error: any) {
      response.statusCode = 400;
      response.send();
    }
  };

  private readonly getAllUsers = async (request: any, response: any): Promise<void> => {
    try {
      response.send(await this.userService.getAll());
    } catch (error: any) {
      response.statusCode = 400;
      response.send();
    }
  };

  private readonly getUserById = async (request: any, response: any): Promise<void> => {
    try {
      const { id } = request.params;
      const theUser = await this.userService.getById(id);

      if(theUser) {
        response.send(theUser);
      } else {
        response.statusCode = 404;
        response.send({
          message: `User with id [${id}] doesn't exist.`,
        });
      }
    } catch (error: any) {
      response.statusCode = 400;
      response.send({
        message: 'Failed to get user.',
        errorMessage: error.message
      });
    }
  };

  private readonly createUser = async (request: any, response: any): Promise<void> => {
    try {
      const savedUser: User = await this.userService.createUser(request.body as User);
      if(savedUser) {
        response.send(savedUser);
      } else {
        response.statusCode = 400;
        response.send();
      }
    } catch (error: any) {
      response.statusCode = 400;
      response.send({
        message: 'Failed to create user.',
        errorMessage: error.message
      });
    }
  }

  private readonly createExercise = async (request: any, response: any): Promise<void> => {
    try {
      const { id } = request.params;
      const user = await this.userService.getById(id);
      if (!user) {
        response.statusCode = 404;
        response.send({
          message: `User with id [${id}] doesn't exist.`,
        });
        return;
      }

      const exercise = request.body as Exercise;
      exercise.userId = id;

      const savedExercise = await this.exerciseService.createExercise(exercise);
      response.send({
        user,
        exercise: savedExercise
      });
    } catch (error: any) {
      response.statusCode = 400;
      response.send({
        message: 'Failed to create exercise.',
        errorMessage: error.message
      });
    }
  };

  private readonly getUserExercises = async (request: any, response: any): Promise<void> => {
    try {
      const { id } = request.params;
      const [user, exercises] = await Promise.all([
        this.userService.getById(id),
        this.exerciseService.getAllByUserId(id)
      ]);

      if(!user) {
        response.statusCode = 404;
        response.send({
          message: `Cannot find user with id [${id}].`,
        });
        return;
      }

      response.send({ user, exercises });
    } catch (error: any) {
      response.statusCode = 400;
      response.send({
        message: 'Failed to get user\'s exercises.',
        errorMessage: error.message
      });
    }
  };

  private readonly getUserExercisesLog = async (request: any, response: any): Promise<void> => {
    try {
      const { id } = request.params;
      const { from, to, limit }: FromToLimitType = request.query;

      const totalCount = await this.exerciseService.getCountByUserId(id);
      if (!from && !to) {
        response.send({ totalCount });
        return;
      }

      const exercises = await this.exerciseService.getByUserIdPaging(
        id, from, to, limit
      );

      response.send({
        totalCount,
        exercises
      });
    } catch (error: any) {
      response.statusCode = 400;
      response.send({
        message: 'Failed to get user\'s exercise.',
        errorMessage: error.message
      });
    }
  };
}
