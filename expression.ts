import {utils as _} from './utils'

import {tree} from './tree'
import {scope} from './scope'

export class expression {

    private tree: tree
    private scope: scope

    value

    constructor(scope: scope, tree: tree) {
        this.scope = scope
        this.tree = tree

        this.compile()
    }

    compile() {
        let root = this.tree.root[0]
        if (root.type === _.token.OPERATOR && root.value ===  _.operator.ASSIGN) {
            let name  = root.left_hand.name
            let e = this.compile_symbol_def(root)
            this.scope.define(name, e)
            //_.jlog(this.scope.symbol[name])
            // TODO: fix expression value
            this.value = e.value
        } else {
            this.value = this._compile(this.tree.root[0])()
        }
    }

    _compile(root) {
        switch(root.type) {
            case _.token.OPERATOR : {
                switch (root.value) {
                    case _.operator.ASSIGN : {
                        let name  = root.left_hand.name
                        let e = this.compile_symbol_def(root)
                        return () => {
                            this.scope.define(name, e)
                        }
                    }
                    case _.operator.PLUS : {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return left() + right()
                        }
                    }
                    case _.operator.MINUS : {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return left() - right()
                        }
                    }
                    case _.operator.TIMES : {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return left() * right()
                        }
                    }
                    case _.operator.DIV : {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return left() / right()
                        }
                    }
                    case _.operator.POW : {
                        let left = this._compile(root.left_hand)
                        let right = this._compile(root.right_hand)
                        return () => {
                            return Math.pow(left(), right())
                        }
                    }
                }
            } 
            case _.token.SYMBOL : {
                let symbol = root.name
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
            case _.token.NUMBER : {
                return () => {
                    return root.value
                }
            }
        }
    }


    compile_symbol_def (root) : expression{
        let symbol = root.left_hand
        let def = root.right_hand
        

        // it's a function
        if (symbol.is_function) {
            let params = []
            symbol.params.foreach(p =>  {
                params.push(p.name)
            })

            let e = new expression(this.scope, root)
            return e

            /* return () => {
                let e = new expression
            } */
        } 

        // it's a variable
        let t = new tree()
        t.push(def)
        let e = new expression(this.scope, t)

        return e
       
    }

    //Unsubscribe for all symbols in the scope
    destroy(){

    }


}