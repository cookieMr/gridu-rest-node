import express, { Express, Router } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../models/User';
import bodyParser from 'body-parser';
import { ExerciseService } from '../services/ExerciseService';
import { Exercise } from '../models/Exercise';

export class RouterController {
  constructor(
    private readonly port: number = Number(process.env.HTTP_PORT) || 8080,
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
    this.router.post('/api/users/:id/logs', this.getUserExercisesCount);

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
      response.send({message: 'Hello GridU!'});
    } catch (error) {
      response.statusCode = 400;
      response.send();
    }
  };

  private readonly getAllUsers = async (request: any, response: any): Promise<void> => {
    try {
      response.send(await this.userService.getAll());
    } catch (error) {
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
        response.send();
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
      const exercise = request.body as Exercise;
      exercise.userId = id;
      const [savedExercise, user] = await Promise.all([
        this.exerciseService.createExercise(exercise),
        this.userService.getById(id)
      ]);

      if(!savedExercise || !user) {
        response.statusCode = 400;
        response.send();
        return;
      }

      const userExercises = await this.exerciseService.getByUserId(id);

      response.send({
        user,
        exercises: userExercises
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
        this.exerciseService.getByUserId(id)
      ]);

      if(!user || !exercises) {
        response.statusCode = 400;
        response.send({
          message: 'Cannot find user or exercise.',
          userFound: !!user,
          userExercises: !!exercises
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

  private readonly getUserExercisesCount = async (request: any, response: any): Promise<void> => {
    try {
      const { id } = request.params;
      const { from, to, limit } = request.query;
      const exercises = await this.exerciseService.getByUserId(id);

      if (!from && !to) {
        response.send({
          count: exercises?.length || 0
        });
        return;
      }

      if (!!from && !!to) {
        const dateFrom = Date.parse(from);
        const dateTo = Date.parse(to);
        const filteredExercise = exercises
          .filter(exercise => Date.parse(exercise.date) >= dateFrom)
          .filter(exercise => Date.parse(exercise.date) <= dateTo);

        response.send({
          count: filteredExercise?.length || 0,
          exercises: !!limit
            ? filteredExercise.slice(0, limit)
            : filteredExercise
        });
        return;
      }

      if (!!to) {
        const dateTo = Date.parse(to);
        const filteredExercise = exercises.filter(exercise => Date.parse(exercise.date) <= dateTo);

        response.send({
          count: filteredExercise?.length || 0,
          exercises: !!limit
            ? filteredExercise.slice(0, limit)
            : filteredExercise
        });
        return;
      }

      if (!!from) {
        const dateFrom = Date.parse(from);
        const filteredExercise = exercises.filter(exercise => Date.parse(exercise.date) >= dateFrom);

        response.send({
          count: filteredExercise?.length || 0,
          exercises: !!limit
            ? filteredExercise.slice(0, limit)
            : filteredExercise
        });
      }
    } catch (error: any) {
      response.statusCode = 400;
      response.send({
        message: 'Failed to get user\'s exercise.',
        errorMessage: error.message
      });
    }
  };
}
