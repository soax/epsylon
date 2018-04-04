import { utils as _ } from './utils'

import { tree } from './tree'
import { scope } from './scope'

export class expression {

    private tree: tree
    private scope: scope

    value
    name: string
    is_assignment: boolean = false

    constructor(scope: scope, tree: tree) {
        this.scope = scope
        this.tree = tree

        this.compile()
    }

    compile() {
        let root = this.tree.root[0]
        if (root.type === _.token.OPERATOR && root.value === _.operator.ASSIGN) {
            this.name = root.left_hand.name
            this.is_assignment = true
            this.value = this.compile_symbol_def(root)
            this.scope.define(this.name, this)
        } else {
            this.value = this._compile(this.tree.root[0])()
        }
    }

    _compile(root) {
        switch (root.type) {
            case _.token.OPERATOR: {
                switch (root.value) {
                    case _.operator.CONCAT : {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return left() + right()
                        }
                    }
                    case _.operator.PLUS: {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return left() + right()
                        }
                    }
                    case _.operator.MINUS: {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return left() - right()
                        }
                    }
                    case _.operator.TIMES: {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return left() * right()
                        }
                    }
                    case _.operator.DIV: {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return left() / right()
                        }
                    }
                    case _.operator.POW: {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return Math.pow(left(), right())
                        }
                    }
                }
            }
            case _.token.SYMBOL: {
                let symbol = root.name
                
                // if symbol already defined on the scope
                if (this.scope.is_defined(symbol)) {
                    this.scope.add_dependency_to(symbol, this)

                    // it's a fuction
                    if (root.is_function) {
                        let par = { params: [] }
                        for (let i = 0; i < root.params.length; i++) {
                            par.params[i] = this._compile(root.params[i])
                        }
                        return () => {
                            return this.scope.get_value_of(symbol).apply(par)
                        }
                    }
                    // it's a variable 
                    return () => {
                        return this.scope.get_value_of(symbol)
                    }
                }

                // if undefined symbol
                if (root.is_function) {
                    // it'a predefined Maths function
                    if (Math[symbol]) {
                        let par = []
                        root.params.forEach(p => {
                            par.push(this._compile(p))
                        })
                        return () => {
                            return _.run_predef_math_function(Math[symbol], par)
                        }   
                    }
                } else {
                    return () => {
                        return symbol
                    }
                }
            }
            case _.token.NUMBER: {
                return () => {
                    return root.value
                }
            }
            case _.token.LATEX: {
                let content = []
                root.content.forEach(c => {
                    if (c.type === _.token.STRING) {
                        content.push(() => c.value )
                    } else if (c.type === _.token.SYMBOL) {
                        content.push(this._compile(c))
                    }
                })
                return () => {
                    let res = ''
                    content.forEach(c => res += c())
                    return res
                }
            }
        }
    }


    _compile_func(root, params) {
        switch (root.type) {
            case _.token.OPERATOR: {
                switch (root.value) {
                    case _.operator.PLUS: {
                        let left = this._compile_func(root.left_hand, params)
                        let right = this._compile_func(root.right_hand, params)
                        return function () {
                            return left.apply(this) + right.apply(this)
                        }
                    }
                    case _.operator.MINUS: {
                        let left = this._compile_func(root.left_hand, params)
                        let right = this._compile_func(root.right_hand, params)
                        return function () {
                            return left.apply(this) - right.apply(this)
                        }
                    }
                    case _.operator.TIMES: {
                        let left = this._compile_func(root.left_hand, params)
                        let right = this._compile_func(root.right_hand, params)
                        return function () {
                            return left.apply(this) * right.apply(this)
                        }
                    }
                    case _.operator.DIV: {
                        let left = this._compile_func(root.left_hand, params)
                        let right = this._compile_func(root.right_hand, params)
                        return function () {
                            return left.apply(this) / right.apply(this)
                        }
                    }
                    case _.operator.POW: {
                        let left = this._compile_func(root.left_hand, params)
                        let right = this._compile_func(root.right_hand, params)
                        return function () {
                            return Math.pow(left.apply(this), right.apply(this))
                        }
                    }
                }
            }
            case _.token.SYMBOL: {
                let symbol = root.name
                // if symbol is part of function parameters
                if (params.lastIndexOf(symbol) > -1) {
                    return function () {
                        return this[symbol]()
                    }
                }
                // if symbol already defined on the scope
                if (this.scope.is_defined(symbol)) {
                    this.scope.add_dependency_to(symbol, this)

                    if (root.is_function) {

                    } else {
                        return () => {
                            return this.scope.get_value_of(symbol)
                        }
                    }
                }
                // if undefined symbol
                if (root.is_function) {

                } else {
                    return () => {
                        return symbol
                    }
                }
            }
            case _.token.NUMBER: {
                return () => {
                    return root.value
                }
            }
        }
    }

    compile_symbol_def(root) {
        let symbol = root.left_hand
        let def = root.right_hand

        // it's a function
        if (symbol.is_function) {

            let params = []
            symbol.params.forEach(p => {
                params.push(p.name)
            })

            let func = this._compile_func(def, params)

            return function () {
                let par = []
                let i = 0
                symbol.params.forEach(p => {
                    par[p.name] = this.params[i++]
                })
                return func.apply(par)
            }
        }

        let value = this._compile(def)()
        return value
    }

    //Unsubscribe for all symbols in the scope
    destroy() {

    }

}