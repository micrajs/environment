export const MockEnvironment = class MockEnvironment
  implements Micra.Environment
{
  all = jest.fn();
  get = jest.fn();
  has = jest.fn();
  init = jest.fn();
  initAsync = jest.fn();
  setValidator = jest.fn();
  validate = jest.fn();
  on = jest.fn();
  emit = jest.fn();
  emitSync = jest.fn();
};
