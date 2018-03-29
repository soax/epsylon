import {parser} from './parser'
import {scope} from './scope'

import {utils as _} from './utils'

let p = new parser()

let s = new scope()

s.eval('cos(0)')

s.eval('f(x): 3x')

s.eval('a: 0')
s.eval('f(f(sin(0)))')
