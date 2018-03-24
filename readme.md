# About

A dynamic maths library.

This library is designed for writing dynamic maths document, as lessons or exercices.

# Usage

``` javascript 
scope  = new Scope()
```

`scope.eval` can evaluate maths expression

```javascript
scope.eval('3 + 4')
// returns 7
```

`scope.eval` can define variables

```javascript
scope.eval('a: 5')
// returns a = 5
```

`scope.eval` can define functions

```javascript
scope.eval('f(x): ax + 5')
// returns f(x) = ax + 5
```

`scope.eval` can call function

```javascript
scope.eval('f(1)')
// returns 10
```

`scope.eval` can redefine variables or function

```javascript
scope.eval('a: 2*5')
// returns a = 10
```

Variables and functions definitions are dynamic. `f` depends on `a` then if `a` changes, `f` changes too

```javascript
scope.eval('f(1)')
// returns 15 
```