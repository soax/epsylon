import {scope} from './scope'
import {expression} from './expression'

export class tree {

    public root = []

    constructor() {

    }

    push(branch: any) {
        this.root.push(branch)
    }

}