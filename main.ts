import {scope} from './scope'

let s = new scope()

//define a new symbol 'a' as a constant (5) inside the scope
s.eval('a: 5')
// -> returns null

//define a new symbol 'b' as an exprssion inside the scope
s.eval('b: 2a')
// -> returns null

//define a new symbol 'f' as a function of a parameter 'x' inside the scope
s.eval('f(x): a*x + b')
// -> returns null

//eval the expression 'f(1) + b' in the scope context
s.eval('f(1)')
// -> returns 15 

//define a new expression that can be evaluated inside the scope s
let e1 = s.compile('a + 3')



