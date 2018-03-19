import {expressionTree} from './expressionTree'



let build_token = {
    'SYMBOL' : function(token, context) {
        return {}
    },
    'OPERATOR' : function(token, context) {
        
    }

}

let rank = {
    'concat': 0,
    ':': 1,
    '=': 2,
    '+': 3,
    '-': 3,
    '*': 4,
    '/': 4,
    '^': 5
}


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

        this.tree = this.fill(this.tree)

        let eTree = this.merge(this.tree)

        console.log(JSON.stringify(eTree, null, 2))

    }

    fill(branch){
        let i = 0;

        let previous = ''
        let filled = []

        while (i < branch.length) {
            if (previous === 'LATEX') {
                filled.push({
                    type: 'OPERATOR',
                    value: 'concat'  
                })
            }
            filled.push(branch)
        }

        return filled
    }


    merge(branch) {

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

        //if there is an operator in the branch
        if (root_index > 0) {
            let left_hand = this.merge(branch.slice(0, root_index))
            let right_hand = this.merge(branch.slice(root_index + 1))

            return {
                type: 'OPERATOR',
                value: branch[root_index].value,
                left_hand: left_hand,
                right_hand: right_hand
            }
        }
        //otherwise
    }


}