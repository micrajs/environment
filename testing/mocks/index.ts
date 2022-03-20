import {vi} from 'vitest';

export const MockEnvironment = class MockEnvironment
  implements Micra.Environment
{
  all = vi.fn();
  get = vi.fn();
  has = vi.fn();
  init = vi.fn();
  initSync = vi.fn();
  validate = vi.fn();
  on = vi.fn();
  emit = vi.fn();
  emitSync = vi.fn();
};
