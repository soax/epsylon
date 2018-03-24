import { tree } from './tree'

import { utils as _ } from './utils'


export class parser {

    ptr: number = 0
    expr: string
    token_tree = []

    constructor() {

    }

    read_token() {
        let c = this.expr[this.ptr]

        // Clear spaces
        while (_.is_space(c)) {
            if (++(this.ptr) >= this.expr.length) {
                return null
            }
            c = this.expr[this.ptr]
        }

        if (_.is_number(c)) {
            return this.read_number()
        }

        if (_.is_operator(c)) {
            return this.read_operator()
        }

        if (_.is_symbol_flag(c)) {
            this.ptr++
            return this.read_symbol(true)
        }

        if (_.is_symbol(c)) {
            return this.read_symbol()
        }

        if (_.is_separator(c)) {
            return this.read_separator()
        }

        if (_.is_block(c)) {
            return this.read_block()
        }

        if (_.is_tex(c)) {
            return this.read_tex()
        }

        throw ('Syntax error at ' + this.ptr + ' : Character ' + c + ' not expected here')
    }


    read_number() {
        let start = this.ptr++
        let str: string = ''
        let point: boolean = false

        let c: string = this.expr[start]
        str += c

        c = this.expr[this.ptr]
        while ((c >= '0' && c <= '9') || (c === '.')) {
            if (c === '.' && point) {
                throw ('Syntax error at ' + this.ptr + ' : Two many "."')
            }
            if (c === '.') point = true

            str += c
            c = this.expr[++(this.ptr)]
        }

        return {
            type: _.token.NUMBER,
            start: start,
            length: this.ptr - start,
            value: Number(str)
        }
    }

    read_operator() {
        let start = this.ptr++
        let str: string = ''

        let c: string = this.expr[start]
        str += c

        return {
            type: _.token.OPERATOR,
            start: start,
            length: this.ptr - start,
            value: _.to_operator(c)
        }
    }

    read_symbol(cst_flag: boolean = false) {
        let start = this.ptr++
        let str: string = ''

        let c: string = this.expr[start]
        str += c

        c = this.expr[this.ptr]
        while ((c >= 'a' && c <= 'z') || (c === '.')) {
            str += c
            c = this.expr[++(this.ptr)]
        }

        if (str[str.length - 1] === '.') {
            throw ('Syntax error at ' + this.ptr + ' :  Symbol name can not end with a point \'.\'')
        }

        return {
            type: _.token.SYMBOL,
            start: start,
            length: this.ptr - start,
            value: str,
            is_const: cst_flag
        }
    }

    read_separator() {
        let start = this.ptr++
        let c: string = this.expr[start]

        return {
            type: _.token.SEPARATOR,
            start: start,
            length: this.ptr - start,
            value: c
        }
    }

    read_block() {

        let token_list = []
        let start = this.ptr++

        let open = this.expr[start]
        let close = _.to_close(open)

        while (this.expr[this.ptr] != close) {
            if (this.ptr >= this.expr.length) {
                throw ('Syntax error at ' + start + ' : ' + open + 'block must be closed by a ' + close)
            }
            token_list.push(this.read_token())
        }
        this.ptr++

        return {
            type: _.token.BLOCK,
            start: start,
            length: this.ptr - start,
            value: open,
            content: token_list
        }
    }

    read_tex() {
        let start = this.ptr++
        let content = []

        let str = ''
        let s_start = start + 1

        let open = this.expr[start]
        let close = _.to_close(open)

        let c = this.expr[this.ptr]

        while (c != close) {
            if (this.ptr >= this.expr.length) {
                throw ('Syntax error at ' + start + ' : ' + open + ' block must be closed by a ' + close)
            }

            if (_.is_symbol_flag(c)) {
                if (str != '') {
                    content.push({
                        type: _.token.STRING,
                        start: s_start,
                        length: this.ptr - s_start,
                        value: str,
                    })
                }
                this.ptr++
                content.push(this.read_symbol())
                str = ''
                s_start = this.ptr
            } else {
                str += c
            }

            c = this.expr[++(this.ptr)]
        }

        if (str != '') {
            content.push({
                type: _.token.STRING,
                start: s_start,
                length: this.ptr - s_start,
                value: str,
            })
        }

        this.ptr++

        return {
            type: _.token.LATEX,
            start: start,
            length: this.ptr - start,
            content: content
        }

    }

    tokenize() {
        let token_list = []
        let previous_token_type = null

        while (this.ptr < this.expr.length) {
            try {
                let token = this.read_token()
                if (token) {
                    if (previous_token_type === _.token.LATEX) {
                        token_list.push({
                            type: _.token.OPERATOR,
                            start: -1,
                            length: -1,
                            value: _.operator.CONCAT
                        })
                    }
                    if (token.type === _.token.LATEX && previous_token_type) {
                        token_list.push({
                            type: _.token.OPERATOR,
                            start: -1,
                            length: -1,
                            value: _.operator.CONCAT
                        })
                    }
                    if (previous_token_type === _.token.NUMBER && token.type === _.token.SYMBOL) {
                        token_list.push({
                            type: _.token.OPERATOR,
                            start: -1,
                            length: -1,
                            value: _.operator.TIMES
                        })
                    }
                    previous_token_type = token.type
                    token_list.push(token)
                }
            } catch (e) {
                console.log(e)
                return
            }
        }

        _.jlog(token_list)
        return token_list
    }

    build_operator(branch) {

        //Look for the root operator
        let root_index = -1
        let root_operator = 100
        for (let i = 0; i < branch.length; i++) {
            if (branch[i].type === _.token.OPERATOR && branch[i].value < root_operator) {
                root_operator = branch[i].value
                root_index = i
            }
        }

        if (root_index === 0)
            throw ('Syntax error at ' + branch[root_index].start + ' : (sub)expression can not start by an operator')

        //if there is an operator in the branch => split in two subranches
        if (root_index > 0) {
            let left_hand
            if (branch[root_index].value === _.operator.ASSIGN) {
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

        if (first.type === _.token.NUMBER) {
            if (size === 1) {
                return {
                    type: 'NUMBER',
                    value: first.value
                }
            }
            throw ('Syntax error after ' + first.start + ' : NUMBER can not be followed by ' + branch[1].type)
        } else
            if (first.type === _.token.SYMBOL) {
                if (size === 1) {
                    return {
                        type: 'SYMBOL',
                        name: first.value
                    }
                }
                if (size === 2) {
                    let second = branch[1]
                    if (second.type === _.token.BLOCK) {
                        // it's a function
                        if (second.value === '(') {
                            let params = this.build_call_params(second.content)
                            return {
                                type: 'SYMBOL',
                                name: first.value,
                                is_function: true,
                                params: params
                            }
                        }
                        // it's an array
                        if (second.value === '[') {
                            // TODO: handle the array case
                        }
                        throw ('Syntax error after ' + first.start + ' : SYMBOL can not be followed by a ' + second.value + 'block')
                    }
                    throw ('Syntax error after ' + first.start)
                }

                throw ('Syntax error at ' + branch[2].start + ' : unexpected token here (Symbol should be followed by one or two token, no more)')
            }
        if (first.type === _.token.BLOCK) {
            if (first.value === '(') {
                return this.build_operator(first.content)
            }
            if (first.value === '[') {
                throw ('Syntax error at ' + first.start + ' : \'[\' is not expected here')
            }
        }

        throw ('Syntax error at ' + first.start + '')
    }


    build_call_params(branch) {
        let params = []
        let first = []

        for (let i = 0; i < branch.length; i++) {
            if (branch[i].type != _.token.SEPARATOR) {
                first.push(branch[i])
            } else {
                if (first.length === 0) {
                    throw ('Syntax error at ' + branch[i].start + ' : missing parameter or two many \',\' .')
                }
                params.push(this.build_operator(first))
                first = []
            }
        }

        if (first.length === 0) {
            throw ('Syntax error at ' + branch[branch.lenght - 1].start + ' : missing parameter or two many \',\' .')
        }
        params.push(this.build_operator(first))

        return params
    }

    build_def_params(branch) {
        let params = []
        let waiting_for = _.token.SYMBOL

        let i = 0

        _.jlog(branch)

        while (i < branch.length) {
            if (branch[i].type === _.token.SYMBOL) {
                params.push({
                    type: 'SYMBOL',
                    name: branch[i].value
                })
                i++
                if (i < branch.length && branch[i].type !== _.token.SEPARATOR) {
                    throw ('Syntax error at ' + branch[i].start + ' : \',\' expected')
                }
            } else {
                throw ('Syntax error at ' + branch[i].start + ' : SYMBOL expected')
            }
            i++
        }
        return params
    }

    build_definition(branch)  {
        let first = branch[0]
        let size = branch.length

        //variable case
        if (size === 1) {
            return {
                type: 'SYMBOL',
                name: first.name,
                is_const: first.is_const
            }
        }

        if (size === 2) {
            let second = branch[1]

            if (second.type !== _.token.BLOCK) {
                throw ('Syntax error at ' + second.start)
            }

            // function case
            if (second.value === '(') {
                let params = this.build_def_params(second.content)

                return {
                    type: 'SYMBOL',
                    name: first.name,
                    is_function: true,
                    is_const: first.is_const,
                    params: params
                }
            }
            // array case
            if (second.value === '[') {
                // TODO: handle the array case 
            }

        }

        throw ('Syntax error after ' + first.start + ' : No operator allowed on left hand of assignment')
    }



    build_tree(token_list): tree {

        let t = new tree()

        t.push(this.build_operator(token_list))

        //_.jlog(t)

        return t

    }

    parse(expr: string): tree {

        this.expr = expr
        this.ptr = 0

        let token_list = this.tokenize()
        let tree = this.build_tree(token_list)

        return tree
    }
}