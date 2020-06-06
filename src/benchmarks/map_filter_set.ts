/* tslint:disable:no-console */

import * as IxES6 from '@reactivex/ix-es2015-cjs/iterable'
import * as IxES6Op from '@reactivex/ix-es2015-cjs/iterable/operators'
import { Event, Suite } from 'benchmark'
import * as IxES5 from 'ix/iterable'
import * as IxES5Op from 'ix/iterable/operators'
import * as _ from 'lodash'
import * as Rx from 'rxjs'
import * as RxOp from 'rxjs/operators'
import { iterate } from '../iterate'

const suite = new Suite()

// Simulate iterating over a very lage Set of strings and applying a filter and a map on it

const hugeSet = new Set<string>()
for (let i = 0; i < 10000; i++) {
    hugeSet.add('file:///foo/bar/' + i)
}

suite.add('Loop', () => {
    const result = new Set()
    for (const uri of hugeSet) {
        if (!uri.startsWith('file://')) {
            continue
        }
        result.add(uri.substr('file:///'.length))
    }
})

suite.add('iterare', () => {
    iterate(hugeSet)
        .filter(uri => uri.startsWith('file://'))
        .map(uri => uri.substr('file:///'.length))
        .toSet()
})

suite.add('Array method chain', () => {
    return new Set(
        Array.from(hugeSet)
            .filter(uri => uri.startsWith('file://'))
            .map(uri => uri.substr('file:///'.length))
    )
})

suite.add('Lodash', () => {
    // Need to convert to Array first, because lodash does not support Sets
    // This uses lodash's lazy evaluation feature
    return new Set(
        _(Array.from(hugeSet))
            .filter((uri: string) => uri.startsWith('file://'))
            .map(uri => uri.substr('file:///'.length))
            .value()
    )
})

suite.add('RxJS', () => {
    Rx.from(hugeSet[Symbol.iterator]())
        .pipe(
            RxOp.filter((uri: string) => uri.startsWith('file://')),
            RxOp.map(uri => uri.substr('file:///'.length)),
            RxOp.toArray(),
            RxOp.map(arr => new Set(arr))
        )
        .subscribe(result => {
            // Finished
        })
})

suite.add('IxJS (ES5)', () => {
    const iter = IxES5.from(hugeSet).pipe(
        IxES5Op.filter((uri: string) => uri.startsWith('file://')),
        IxES5Op.map(uri => uri.substr('file:///'.length))
    )
    return IxES5.toSet(iter)
})

suite.add('IxJS (ES6)', () => {
    const iter = IxES6.from(hugeSet).pipe(
        IxES6Op.filter((uri: string) => uri.startsWith('file://')),
        IxES6Op.map(uri => uri.substr('file:///'.length))
    )
    return IxES6.toSet(iter)
})

suite.on('cycle', (event: Event) => {
    console.log(String(event.target))
})

suite.on('complete', function(this: Suite) {
    console.log('Fastest is ' + this.filter('fastest').map('name' as any))
})

suite.run({ async: true })
