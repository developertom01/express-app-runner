import { AppRunnerOptions } from './interfaces';
import { Express } from 'express';
import cluster from 'cluster';
import os from 'os';

export default class AppRunner {
  /**
   * Get instance of your app and spin up instances for you
   * @param {Express} app - The Express app that you want to run.
   * @param {AppRunnerOptions} options - AppRunnerOptions
   */
  constructor(
    private readonly app: Express,
    private readonly options?: AppRunnerOptions
  ) {}

  /**
   *  This spawns multiple child processes per number of cpu cores and run app in each process
   */
  private spawn = (cb?: () => void) => {
    const numCPU = os.cpus().length;

    if (!cluster.isWorker) {
      console.log(
        `${numCPU} CPU cores detected. Spinning ${numCPU} worker processes`
      );
      for (let i = 0; i < numCPU; i++) {
        cluster.fork();
      }
      cluster.on('exit', worker => {
        console.log(`Worker ${worker.process.pid}`);
        cluster.fork();
      });
    } else {
      this.app.listen(this.options?.port ?? 3000, () => {
        if (cb) cb();
      });
      console.log(`App running on process ${process.pid}`);
    }
  };

  /* Run default app */
  private runDefault = (cb?: () => void) => {
    this.app.listen(this.options?.port ?? 3000, () => {
      console.log(`App running on process ${process.pid}`);
      if (cb) cb();
    });
  };

  /* This is the code that will be run in the child process. App runs default when in development or
testing mode but runs child process for every cpu core */
  public listen = (cb?: () => void) => {
    if (
      !this.options?.env ||
      this.options.env === 'development' ||
      this.options.env === 'test'
    ) {
      this.runDefault(cb);
    } else {
      this.spawn(cb);
    }
  };
}
