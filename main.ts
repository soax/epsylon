import {parser} from './parser'
import {scope} from './scope'

import {utils as _} from './utils'

let p = new parser()

let s = new scope()

s.symbol['a'] = {eval: () => {return 5}}
s.symbol['b'] = {eval: () => {return 10}}

s.eval('c: 5')
s.eval('d: a + b')

s.eval('c')
s.eval('d')
