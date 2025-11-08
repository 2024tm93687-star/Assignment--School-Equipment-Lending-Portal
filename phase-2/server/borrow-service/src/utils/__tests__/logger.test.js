import logger from '../logger.js';

describe('logger util', () => {
  it('exports logging methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });
});
