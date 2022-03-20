/// <reference types="@micra/core/environment" />
import { EventEmitter } from '@micra/event-emitter';

export class Environment
  extends EventEmitter<Micra.EnvironmentEvents>
  implements Micra.Environment
{
  envs: Micra.Environment[] = [];
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  protected validator: (env: Record<string, unknown>) => void = () => {
    this.envs.forEach((env) => env.validate());
  };

  addSources(...envs: Micra.Environment[]): void {
    this.envs = this.envs.concat(envs);
    envs.forEach((env) => env.on('set', (event) => this.emit('set', event)));
  }

  all<
    D extends Partial<Application.EnvironmentVariables> = Application.EnvironmentVariables,
  >(): D {
    return this.envs.reduce(
      (variables: Partial<D>, env) => ({
        ...env.all(),
        ...variables,
      }),
      {},
    ) as D;
  }

  get<K extends keyof Application.EnvironmentVariables>(
    key: K,
    fallback?: Application.EnvironmentVariables[K],
  ): Application.EnvironmentVariables[K] {
    return (
      this.envs.find((env) => env.has(key))?.get(key, fallback) ??
      (fallback as Application.EnvironmentVariables[K])
    );
  }

  has<K extends keyof Application.EnvironmentVariables>(key: K): boolean {
    return this.envs.some((env) => env.has(key));
  }

  init(): void {
    this.envs.forEach((env) => env.init());
  }

  async initAsync(): Promise<void> {
    await Promise.all(this.envs.map((env) => env.initAsync()));
  }

  setValidator(
    validator: (definitions: Record<string, unknown>) => void,
  ): void {
    this.validator = validator;
  }

  validate(): void {
    this.validator({});
  }
}
