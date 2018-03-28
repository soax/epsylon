import { parser } from './parser'
import { tree } from './tree'
import { expression } from './expression'

import {utils as _} from './utils'

export class scope {

    symbol = []
    dependency = []

    constructor() {

    }


    eval(expr: string) {
        let e = this.compile(expr)
        return e.value;
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
        this.update_dependency_of(name)
    }

    is_defined(name: string) {
        return this.symbol[name] || false
    }

    get_value_of(name: string) {
        return this.symbol[name].value
    }

    add_dependency_to(name : string, e: expression){
        if (! this.dependency[name]) {
            this.dependency[name] = []
            this.dependency[name].push(e)
        } else {
            if (this.dependency[name].indexOf(e) < 0) {
                this.dependency[name].push(e)
            }
        }
    }

    update_dependency_of(name: string){
        if (this.dependency[name]) {
            this.dependency[name].forEach(e => {
                e.compile()
            });
        }
    }

}
