import {parser} from './parser'
import {scope} from './scope'

import {utils as _} from './utils'

let p = new parser()

let s = new scope()

s.eval('a: 5')
 _.log(s.eval('c: 5 + a'))

 _.log(s.eval('c + 2'))
 
 s.eval('a: 10')
 
 _.log(s.eval('c + 2 + a'))

 s.eval('c: 2a')

 console.dir(s.symbol)

// s.eval('d: a + b')

// s.eval('c')
// s.eval('d')

// let e = s.compile('( 10 + 2a ) / 5') 

// _.log('e : ', e.value)

// s.symbol['a'] = {value: 10}

// _.log('e : ', e.value)

// s.update_dependency_of('a')

// _.log('e : ', e.value)


