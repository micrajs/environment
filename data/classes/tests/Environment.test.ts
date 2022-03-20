import {MockEnvironment} from '@/testing/mocks';
import {Environment} from '../Environment';

declare global {
  namespace Application {
    interface EnvironmentVariables {
      value: number;
    }
  }
}

describe('Environment tests', () => {
  it('should return an object by default when all envs are retrieved', () => {
    const environment = new Environment();

    const list = environment.all();

    expect(list).toMatchObject({});
  });

  it('should return an empty object by default when all envs are retrieved', () => {
    const environment = new Environment();

    const list = environment.all();

    expect(Object.keys(list).length).toBe(0);
  });

  it('should add a new environment', () => {
    const env = new MockEnvironment();
    const environment = new Environment();

    environment.addSources(env);

    expect(environment.envs).toEqual([env]);
  });

  it('should return the union of all the sources values', () => {
    const env1 = new MockEnvironment();
    env1.all.mockReturnValue({value1: 42});
    const env2 = new MockEnvironment();
    env2.all.mockReturnValue({value2: 24});
    const environment = new Environment();
    environment.addSources(env1, env2);

    const variables = environment.all();

    expect(variables).toEqual({
      value1: 42,
      value2: 24,
    });
  });

  it('should get a variable from a source', () => {
    const env = new MockEnvironment();
    env.has.mockImplementation((key) => key === 'value');
    env.get.mockImplementation(() => 42);
    const environment = new Environment();
    environment.addSources(env);

    const value = environment.get('value');

    expect(value).toBe(42);
  });

  it('should return a fallback if a variable is not set in any sources', () => {
    const env = new MockEnvironment();
    const environment = new Environment();
    environment.addSources(env);

    const value = environment.get('value', 42);

    expect(value).toBe(42);
  });

  it('should return true if a variable exists in a source', () => {
    const env = new MockEnvironment();
    const environment = new Environment();
    environment.addSources(env);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exists = environment.has<any>('does not exist');

    expect(exists).toBe(false);
  });

  it('should initialize all sources', () => {
    const env1 = new MockEnvironment();
    const env2 = new MockEnvironment();
    const environment = new Environment();
    environment.addSources(env1, env2);

    environment.initSync();

    expect(env1.initSync).toHaveBeenCalled();
    expect(env2.initSync).toHaveBeenCalled();
  });

  it('should initialize all sources asynchronously', async () => {
    const env1 = new MockEnvironment();
    const env2 = new MockEnvironment();
    const environment = new Environment();
    environment.addSources(env1, env2);

    await environment.init();

    expect(env1.init).toHaveBeenCalled();
    expect(env2.init).toHaveBeenCalled();
  });

  it('should validate all sources', () => {
    const validator = vi.fn();
    const env1 = new MockEnvironment();
    env1.all.mockReturnValue({value: 42});
    const environment = new Environment();
    environment.addSources(env1);

    environment.validate(validator);

    expect(validator).toHaveBeenCalledWith({value: 42});
  });
});
