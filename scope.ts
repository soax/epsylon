import { parser } from './parser'
import { tree } from './tree'
import { expression } from './expression'


export class scope {

    symbol = []

    constructor() {

    }

    eval(expr: string) {
        let e = this.compile(expr)
        return e.eval()
    }


    compile(expr: string) : expression{
        let p = new parser()
        let tree = p.parse(expr)

        let e = new expression(this, tree)
        return e
    }

    destroy(e: expression) {
        e.destroy()
    }

    define(name, e: expression){
        if (this.symbol[name]) {
            this.destroy(this.symbol[name])    
        }
        this.symbol[name] = e
    }



}
