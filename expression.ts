import {utils as _} from './utils'

import {tree} from './tree'
import {scope} from './scope'

export class expression {

    private tree: tree
    private scope: scope

    constructor(scope: scope, tree: tree) {
        this.scope = scope
        this.tree = tree

        this.compile(tree.root[0])

    }

    compile(root) {
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

                    }
                }
            } 
            case _.token.SYMBOL : {

            }
            case _.token.NUMBER : {

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
        let e = new expression(this.scope, def)

       
    }

    //Unsubscribe for all symbols in the scope
    destroy(){

    }


    eval() {

    }

}