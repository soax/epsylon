import {expressionTree} from './expressionTree'

import {utils as _} from './utils'

/* let rank = {
    'concat': 0,
    ':': 1,
    '=': 2,
    '+': 3,
    '-': 3,
    '*': 4,
    '/': 4,
    '^': 5
} */

export class tokenTree {

    tree = []

    constructor() {

    }

    push(token: any) {
        this.tree.push(token)
    }

    build(){

        //let eTree = new expressionTree()

        let context = []

        let eTree = this.build_operator(this.tree)

        console.log(JSON.stringify(eTree, null, 2))

    }

    build_operator(branch) {

        //Look for the root operator
        let root_index = -1
        let root_rank = 100
        for (let i = 0;  i < branch.length; i++) {
            if (branch[i].type === 'OPERATOR' && rank[branch[i].value] < root_rank) {
                root_rank = rank[branch[i].value]
                root_index = i
            }
        }

        console.log(root_index)

        if (root_index === 0)
            throw ('Syntax error at ' + branch[root_index].start + ' : (sub)expression can not start by an operator')

        //if there is an operator in the branch => split in two subranches
        if (root_index > 0) {
            let left_hand
            if (branch[root_index].value === ':') {
                left_hand = this.build_definition(branch.slice(0, root_index))
            } else {
               left_hand = this.build_operator(branch.slice(0, root_index))
            }
            let right_hand = this.build_operator(branch.slice(root_index + 1))

            return {
                type: 'OPERATOR',
                value: branch[root_index].value,
                left_hand: left_hand,
                right_hand: right_hand
            }
        }

        //otherwise
        let first = branch[0]
        let size = branch.length

        if (first.type === 'NUMBER') {
            if (size === 1){
                return  {
                    type: 'NUMBER',
                    value: first.value
                }
            }
            throw ('Syntax error after ' + first.start + ' : NUMBER can not be followed by ' + branch[1].type )
        } else 
        if (first.type === 'SYMBOL') {
            if (size === 1) {
                return {
                    type: 'SYMBOL',
                    value: first.value
                }
            } 
            if (size === 2) {
                let second = branch[1]
                if (second.type === 'BLOCK') {
                    if (second.value === '(') {

                    } 
                    if (second.value === '[') {

                    }
                    throw ('Syntax error after ' + first.start + ' : SYMBOL can not be followed by a ' + second.value + 'block' )
                }
            }
        }
    }

    build_definition(branch) {

    }


}