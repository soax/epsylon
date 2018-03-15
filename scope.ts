
    class expression {

        scope: scope
        tree: tree

        eval () {

        }
    }

    class tree {

        compile(scope: scope) : expression{
            return scope._compile(this);
        }

    }

    class tokenlist {

    }
    

    class parser {

        current: number

        constructor(expr: String) {

        }

        parse() : tree {
            let t = new tree();

            return t;

        }


    }


    export class scope {

        definition = []
        
        constructor() {
            
        }

        eval(expr: String) {
            let p = new parser(expr)

            return p.parse().compile(this).eval()
        }


        _eval(expr: expression) {

            return expr.eval() 
        }

        compile(expr: String) : expression{
            let p = new parser(expr)

            return p.parse().compile(this)
        }

        _compile(tree: tree) : expression{
            let e = new expression()

            return e
        }

        
    }
