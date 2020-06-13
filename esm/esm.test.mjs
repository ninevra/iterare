import * as assert from 'assert'

import iterate, * as iterare from 'iterare'

describe('ESModule import', () => {
    it('should export iterate as a named export', () => {
        assert.equal(typeof iterare.iterate, 'function')
        assert.deepEqual(
            iterare
                .iterate(['a', 'b', 'c'])
                .map(char => char + '.')
                .toArray(),
            ['a.', 'b.', 'c.']
        )
    })

    it('should export zip as a named export', () => {
        assert.equal(typeof iterare.zip, 'function')
        assert.deepEqual(iterare.zip([1, 2, 3], ['a', 'b', 'c']).toArray(), [[1, 'a'], [2, 'b'], [3, 'c']])
    })

    it('should have no exports besides iterate, zip, and default', () => {
        assert.equal(Object.keys(iterare).length, 3)
    })

    it('should export iterate as the default export', () => {
        assert.equal(iterate, iterare.iterate)
    })
})
