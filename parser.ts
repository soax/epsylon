import {tokenTree} from './tokenTree'

import {utils as _} from './utils'


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
            const: cst_flag
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

        let token_branch = []
        let start = this.ptr++

        let open = this.expr[start]
        let close = _.to_close[open]

        while (this.expr[this.ptr] != close) {
            if (this.ptr >= this.expr.length) {
                throw ('Syntax error at ' + start + ' : ' + open + 'block must be closed by a ' + close)
            }
            token_branch.push(this.read_token())
        }
        this.ptr++

        return {
            type: _.token.BLOCK,
            start: start,
            length: this.ptr - start,
            value: open,
            content: token_branch
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

    tokenize_expression() {
        let token_tree = new tokenTree()
        let previous_token_type = null

        while (this.ptr < this.expr.length) {
            try {
                let token = this.read_token()
                if (token) {
                    if (previous_token_type === _.token.LATEX) {
                        token_tree.push({
                            type: _.token.OPERATOR,
                            start: -1,
                            length: -1,
                            value: _.operator.CONCAT                        })
                    }
                    if (token.type === _.token.LATEX && previous_token_type) {
                        token_tree.push({
                            type: _.token.OPERATOR,
                            start: -1,
                            length: -1,
                            value: _.operator.CONCAT
                        })
                    }
                    if (previous_token_type === _.token.NUMBER && token.type === _.token.SYMBOL) {
                        token_tree.push({
                            type: _.token.OPERATOR,
                            start: -1,
                            length: -1,
                            value: _.operator.TIMES
                        })
                    }
                    previous_token_type = token.type
                    token_tree.push(token)
                }    
            } catch (e) {
                console.log(e)
                return
            }
        }

        console.log(JSON.stringify(token_tree, null, '\t'))
        return token_tree
    }

    parse(expr: string): tokenTree{

        this.expr = expr
        this.ptr = 0

        return this.tokenize_expression()

    }
}