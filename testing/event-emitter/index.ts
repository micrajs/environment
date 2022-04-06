import {vi} from 'vitest';

export const MockEventEmitter = class MockEventEmitter
  implements Micra.EventEmitter
{
  on = vi.fn();
  emit = vi.fn();
  emitSync = vi.fn();
};
