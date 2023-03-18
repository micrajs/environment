import {EventEmitter} from '@micra/event-emitter';

export class Environment
  extends EventEmitter<Micra.EnvironmentEvents>
  implements Micra.Environment
{
  envs: Micra.Environment[] = [];
  private _uninitialized: Micra.Environment[] = [];

  addSources(...envs: Micra.Environment[]): void {
    this.envs = this.envs.concat(envs);
    this._uninitialized = this._uninitialized.concat(envs);
    envs.forEach((env) => env.on('set', (event) => this.emit('set', event)));
  }

  all<
    D extends Partial<Application.EnvironmentVariables> = Application.EnvironmentVariables,
  >(): D {
    return this.envs.reduce(
      (variables: Partial<D>, env) => ({
        ...variables,
        ...env.all(),
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

  initSync(): void {
    while (this._uninitialized.length) {
      this._uninitialized.pop()?.initSync();
    }
  }

  async init(): Promise<void> {
    const promises: Promise<unknown>[] = [];
    while (this._uninitialized.length) {
      promises.push(this._uninitialized.pop()?.init());
    }

    await Promise.all(promises);
  }

  validate(validator: Micra.EnvironmentValidator): void {
    validator(this.all());
  }

  createScope(): Environment {
    const env = new Environment();
    env.envs = this.envs.slice();
    env.on('set', (event) => this.emit('set', event));
    return env;
  }
}
