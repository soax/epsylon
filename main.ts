import {parser} from './parser'

let p = new parser()

p.parse('#g(x): #a*x + b').build()