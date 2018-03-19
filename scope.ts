import {parser} from './parser'

    class expression {

        scope: scope
        tree: tree

        eval () {

        }
    }

   // string -> tree -> expr
   
   
   
   
    class tree {

        compile(scope: scope) : expression{
            return scope._compile(this);
        }

    }

    class tokenlist {

    }
    

    export class scope {

        definition = []
        
        constructor() {
            
        }

        eval(expr: string) {
            let p = new parser()

            return p.parse(expr).build()
        }


        _eval(expr: expression) {

            return expr.eval() 
        }

        compile(expr: string){
            let p = new parser()

            return p.parse(expr).build()
        }

        _compile(tree: tree){
            let e = new expression()

            return e
        }

        
    }
