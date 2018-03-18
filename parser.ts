const _space = {
    ' '  : true,
    '\t' : true,
}
function is_space(c: string) {
    return _space[c] || false
}

const _separator = {
    ',' : true
}
function is_separator (c: string) {
    return _separator[c] || false
}

const _flag = {
    '$' : true,
    '#' : true
}
function is_flag (c: string) {
    return _flag[c] || false
}

const _operator = {
    '+' : true,
    '-' : true,
    '*' : true,
    '/' : true,
    '^' : true,
    '=' : true,
    ':' : true,
}
function is_operator (c: string) {
    return _operator[c] || false
}

let _function = {
    'cos' : true,
    'sin' : true,
    'deriv' : true,
    'solve' : true,
    'sum' : true,
    'avg' : true
}
function is_function (c: string) {
    return _function[c] || false
}

function is_number (c: string) {
    return (c >= '0' && c <= '9') || c === '-'
}

function is_symbol (c: string) {
    return (c >= 'a' && c <= 'z')
}

const _block = {
    '(' : true,
    '[' : true,
    '{' : true,
}
function is_block (c) {
    return _block[c] || false
}

const _tex = {
    '"' : true
}
function is_tex (c) {
    return _tex[c] || false 
}

const _tex_symbol_token = {
    '$' : true,
}
function is_tex_symbol_token (c) {
    return _tex_symbol_token[c] || false 
}

const _closing = {
    '(' : ')',
    '[' : ']',
    '{' : '}',
    '"' : '"'
}



export class parser {

    ptr: number = 0
    expr: string
    token  = []

    constructor () {
       
    }

    read_partial() {
        let c = this.expr[this.ptr]
        console.log(this.ptr)

        // Clear spaces
        while (is_space(c)) {
            c = this.expr[++(this.ptr)]
        }

        if (is_number(c)) {
            return this.read_number()
        }

        if (is_operator(c)) {
            return this.read_operator()
        }

        if (is_symbol(c)) {
            return this.read_symbol()
        }

        if (is_separator(c)) {
            return this.read_separator()
        }

        if (is_block(c)) {
            return this.read_block()
        }

        if (is_tex(c)) {
            return this.read_tex()
        }
    }


    read_number () {
        let start = this.ptr++
        let str : string = ''
        let point: boolean = false

        let c: string = this.expr[start]
        str += c

        c = this.expr[this.ptr]
        while ( (c >= '0' && c <= '9') || (c === '.')) {
            if (c === '.' && point) {
                throw ('Syntax error at ' + this.ptr + ' : Two many "."' )
            }
            if (c === '.') point = true 

            str +=c
            c = this.expr[++(this.ptr)]
        }

        return {
            type : 'NUMBER',
            start: start,
            length: this.ptr - start,
            value: Number(str)
        }
    }

    read_operator () {
        let start = this.ptr++
        let str: string = ''

        let c: string = this.expr[start]
        str += c

        return {
            type : 'OPERATOR',
            start: start,
            length: this.ptr - start,
            value: c  
        }
    }


    read_symbol () {
        let start = this.ptr++
        let str: string = ''

        let c: string = this.expr[start]
        str += c

        c = this.expr[this.ptr]
        while ( (c >= 'a' && c <= 'z')) {
            str +=c
            c = this.expr[++(this.ptr)]
        }

        return {
            type : 'SYMBOL',
            start: start,
            length: this.ptr - start,
            value: str
        }
    }

    read_separator () {
        let start = this.ptr++
        let str: string = ''

        let c: string = this.expr[start]
        str += c

        return {
            type : 'SEPARATOR',
            start: start,
            length: this.ptr - start,
            value: str
        }
    }

    read_block () {

        let partial = []
        let start = this.ptr++

        let open = this.expr[start]
        let close = _closing[open]

        while (this.expr[this.ptr] != close) {
            if (this.ptr >= this.expr.length) {
                throw ('Syntax error at ' + start + ' : ' + open + 'block must be closed by a ' + close)
            }
            partial.push(this.read_partial())
        }
        this.ptr++

        return {
            type: 'BLOCK',
            start: start,
            length: this.ptr - start,
            value: open,
            content: partial
        }
    }

    read_tex () {
        let start = this.ptr++

        let open = this.expr[start]
        let close = _closing[open]
    }
   
    parse (expr: string) {

        this.expr = expr
        this.ptr = 0
        
        let partial = []
        let p

        while (this.ptr < this.expr.length) {
            try {
                partial.push(this.read_partial())   
            } catch (e) {
                console.log("error", e)
                console.log(JSON.stringify(partial, null, '\t'))
                return
            }
        }

        console.log(JSON.stringify(partial, null, '\t'))
    }


}