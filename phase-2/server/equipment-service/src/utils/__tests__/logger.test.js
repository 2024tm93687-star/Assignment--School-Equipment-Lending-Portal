import logger from '../logger.js';

describe('equipment-service logger', () => {
  it('has logger methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });
});
