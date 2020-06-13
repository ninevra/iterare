const assert = require('assert');
const iterare = require('iterare');

describe('CommonJS require()', () => {
  it('should export {iterate, zip, default: iterate}', () => {
    assert.equal(typeof iterare.iterate, 'function');
    assert.equal(typeof iterare.zip, 'function');
    assert.deepEqual(iterare, {
      iterate: iterare.iterate,
      zip: iterare.zip,
      default: iterare.iterate
    });
  });
});
