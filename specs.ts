import {scope} from './scope'

let s = new scope()

//define a new symbol 'a' as a constant (5) inside the scope
s.eval('a: 5')
// -> returns 'a: 5'

//define a new symbol 'b' as an exprssion inside the scope
s.eval('b: 2a')
// -> returns 'b: 10'

//define a new symbol 'f' as a function of a parameter 'x' inside the scope
s.eval('f(x): a*x + b')
// -> returns 'f(x): 5x + 10'
// f depends on a and b values
// if a or b are updated : f is updated

//define a new constant symbol 'g' as a function of a parameter 'x' inside the scope
s.eval('#g(x): a*x + b')
// -> returns 'g(x): 5x + 10'
// g does not depend on a and b values
// if a or b are updated : g is NOT updated

//eval the expression 'f(1)' in the scope context
s.eval('f(1)')
// -> returns '15' 

//eval the expression 'g(1)' in the scope context
s.eval('g(1)')
// -> returns '15'

//change 'a' value inside the scope
s.eval('a: 2')
// -> return  'a: 2'
// => 'b' and 'f' are updated to take into account the new 'a' value)
// => 'b' is now defined as 'b: 4'
// => 'f' is now defined as 'f(x): 2x + 4'

//eval the expression 'f(1)' in the scope context
s.eval('f(1)')
// -> returns '6'

//eval the expression 'g(1)' in the scope context
s.eval('g(1)')
// -> returns '15'

// compute the derivative of 'f' according to x
s.eval('deriv(f, x)')
// -> returns '2'

s.eval('deriv(4x^2 + 5x + 2, x)')
// -> returns '8x + 5'

s.eval('h(x): deriv(4x^2 + 5x + 2, x)')
// -> returns 'h(x): 8x + 5'

s.eval('h(1)')
// -> returns '13'




// eval an expression that contains a formal symbol (that can not be replaced by a value)
s.eval('4*#a + 5*4')
// -> returns '4a + 20'

s.eval('deriv(a*x^2 + b*x, x')
// -> returns 2x + 4

s.eval('deriv(#a*x^2 + #b*x, x')
// -> returns 'ax + b'




//define a new expression that can be evaluated inside the scope s
let e1 = s.compile('a + 3')

e1.eval()
// -> returns '5'

s.eval('a: 1')
// -> returns 'a: 1'
// if the scope is updated then expression compiled inside the scope are also updated

e1.eval()
// -> returns '4'




// eval can display text (latex format) between ""
s.eval('f')
// -> returns 'f(x) = x + 2 '

s.eval('"f("a") = " f(a)')
// -> return 'f(1) = 3'

//a definition can be replaced by its value by using $. $a <=> s.eval(a)
s.eval('"f($a) = " f(a)')
// -> return 'f(1) = 3'

let e2 = s.compile('"f($a) = " f(a)')
s.eval('a: 2')
e2.eval()
// -> return 'f(2) = 6'



// definition can be an array of value (or a vector)
s.eval('data: [1, 2, 3, 4, 5]')
// -> return 'data: [1, 2, 3, 4, 5]'
s.eval('size(data)')
// -> return '5'
s.eval('max(data)')
// -> return '5'
s.eval('sum(data)')
// -> return '15'

s.eval('data[1] = 5')
// -> return 'data : [5, 2, 3, 4, 5]'

s.eval('"\sum_{i=1}^{$size(data)}data_i = " sum(data)')
// -> return  '\sum_{i=1}^{5}d_i = 19'



// definition can be an array of array. Each sub array can be named
s.eval('d: [x: [1, 2, 4], f: [0.25, 0.5, 0.25]]')
// -> return 'd: [x: [1, 2, 4], f: [0.25, 0.5, 0.25]]'
s.eval('d.x')
// -> return '[1, 2, 4]'
s.eval('avg(d.x)')
// -> return '2.33'

// weighted average
s.eval('"\mu_x = " avg(d.x, d.f)')
// return '1.75'

// or not named (like a matrix or vector collection)
s.eval('m: [[1, 2, 3], [4, 5, 6]]')
// -> return 'm: [[1, 2, 3], [4, 5, 6]]'
s.eval('m[1]')
// -> return '[1, 2, 3]'
s.eval('m[1] + m[2]')
// -> return [5, 7, 9] 





s.eval('1 & 3')
// -> return '1'
s.eval('1 & 0 ')
// -> return '0'

s.eval('5 > 3')
// -> return '1'

s.eval('x + 2 = 4')
// -> return 'x: 2'