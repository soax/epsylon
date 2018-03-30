"use strict";
exports.__esModule = true;
var tree_1 = require("./tree");
var utils_1 = require("./utils");
var parser = /** @class */ (function () {
    function parser() {
        this.ptr = 0;
        this.token_tree = [];
    }
    parser.prototype.read_token = function () {
        var c = this.expr[this.ptr];
        // Clear spaces
        // while (_.is_space(c)) {
        //     if (++(this.ptr) >= this.expr.length) {
        //         return null
        //     }
        //     c = this.expr[this.ptr]
        // }
        if (utils_1.utils.is_space(c)) {
            this.ptr++;
            return null;
        }
        if (utils_1.utils.is_number(c)) {
            return this.read_number();
        }
        if (utils_1.utils.is_operator(c)) {
            return this.read_operator();
        }
        if (utils_1.utils.is_symbol_flag(c)) {
            this.ptr++;
            return this.read_symbol(true);
        }
        if (utils_1.utils.is_symbol(c)) {
            return this.read_symbol();
        }
        if (utils_1.utils.is_separator(c)) {
            return this.read_separator();
        }
        if (utils_1.utils.is_block(c)) {
            return this.read_block();
        }
        if (utils_1.utils.is_tex(c)) {
            return this.read_tex();
        }
        throw ('Syntax error at ' + this.ptr + ' : Character ' + c + ' not expected here');
    };
    parser.prototype.read_number = function () {
        var start = this.ptr++;
        var str = '';
        var point = false;
        var c = this.expr[start];
        str += c;
        c = this.expr[this.ptr];
        while ((c >= '0' && c <= '9') || (c === '.')) {
            if (c === '.' && point) {
                throw ('Syntax error at ' + this.ptr + ' : Two many "."');
            }
            if (c === '.')
                point = true;
            str += c;
            c = this.expr[++(this.ptr)];
        }
        return {
            type: utils_1.utils.token.NUMBER,
            start: start,
            length: this.ptr - start,
            value: Number(str)
        };
    };
    parser.prototype.read_operator = function () {
        var start = this.ptr++;
        var str = '';
        var c = this.expr[start];
        str += c;
        return {
            type: utils_1.utils.token.OPERATOR,
            start: start,
            length: this.ptr - start,
            value: utils_1.utils.to_operator(c)
        };
    };
    parser.prototype.read_symbol = function (cst_flag) {
        if (cst_flag === void 0) { cst_flag = false; }
        var start = this.ptr++;
        var str = '';
        var c = this.expr[start];
        str += c;
        c = this.expr[this.ptr];
        while ((c >= 'a' && c <= 'z') || (c === '.')) {
            str += c;
            c = this.expr[++(this.ptr)];
        }
        if (str[str.length - 1] === '.') {
            throw ('Syntax error at ' + this.ptr + ' :  Symbol name can not end with a point \'.\'');
        }
        return {
            type: utils_1.utils.token.SYMBOL,
            start: start,
            length: this.ptr - start,
            name: str,
            is_const: cst_flag
        };
    };
    parser.prototype.read_separator = function () {
        var start = this.ptr++;
        var c = this.expr[start];
        return {
            type: utils_1.utils.token.SEPARATOR,
            start: start,
            length: this.ptr - start,
            value: c
        };
    };
    parser.prototype.read_block = function () {
        var token_list = [];
        var start = this.ptr++;
        var open = this.expr[start];
        var close = utils_1.utils.to_close(open);
        var previous_token_type = null;
        while (this.expr[this.ptr] != close) {
            if (this.ptr >= this.expr.length) {
                throw ('Syntax error at ' + start + ' : ' + open + 'block must be closed by a ' + close);
            }
            var token = this.read_token();
            if (token) {
                if (previous_token_type === utils_1.utils.token.NUMBER && token.type === utils_1.utils.token.SYMBOL) {
                    token_list.push({
                        type: utils_1.utils.token.OPERATOR,
                        start: -1,
                        length: -1,
                        value: utils_1.utils.operator.TIMES
                    });
                }
                token_list.push(token);
                previous_token_type = token.type;
            }
        }
        this.ptr++;
        return {
            type: utils_1.utils.token.BLOCK,
            start: start,
            length: this.ptr - start,
            value: open,
            content: token_list
        };
    };
    parser.prototype.read_tex = function () {
        var start = this.ptr++;
        var content = [];
        var str = '';
        var s_start = start + 1;
        var open = this.expr[start];
        var close = utils_1.utils.to_close(open);
        var c = this.expr[this.ptr];
        while (c != close) {
            if (this.ptr >= this.expr.length) {
                throw ('Syntax error at ' + start + ' : ' + open + ' block must be closed by a ' + close);
            }
            if (utils_1.utils.is_symbol_flag(c)) {
                if (str != '') {
                    content.push({
                        type: utils_1.utils.token.STRING,
                        start: s_start,
                        length: this.ptr - s_start,
                        value: str
                    });
                }
                this.ptr++;
                content.push(this.read_symbol());
                str = '';
                s_start = this.ptr;
            }
            else {
                str += c;
            }
            c = this.expr[++(this.ptr)];
        }
        if (str != '') {
            content.push({
                type: utils_1.utils.token.STRING,
                start: s_start,
                length: this.ptr - s_start,
                value: str
            });
        }
        this.ptr++;
        return {
            type: utils_1.utils.token.LATEX,
            start: start,
            length: this.ptr - start,
            content: content
        };
    };
    parser.prototype.tokenize = function () {
        var token_list = [];
        var previous_token_type = null;
        while (this.ptr < this.expr.length) {
            try {
                var token = this.read_token();
                if (token) {
                    if (previous_token_type === utils_1.utils.token.LATEX) {
                        token_list.push({
                            type: utils_1.utils.token.OPERATOR,
                            start: -1,
                            length: -1,
                            value: utils_1.utils.operator.CONCAT
                        });
                    }
                    if (token.type === utils_1.utils.token.LATEX && previous_token_type) {
                        token_list.push({
                            type: utils_1.utils.token.OPERATOR,
                            start: -1,
                            length: -1,
                            value: utils_1.utils.operator.CONCAT
                        });
                    }
                    if (previous_token_type === utils_1.utils.token.NUMBER && token.type === utils_1.utils.token.SYMBOL) {
                        token_list.push({
                            type: utils_1.utils.token.OPERATOR,
                            start: -1,
                            length: -1,
                            value: utils_1.utils.operator.TIMES
                        });
                    }
                    previous_token_type = token.type;
                    token_list.push(token);
                }
            }
            catch (e) {
                // _.log(e)
                return;
            }
        }
        //_.jlog(token_list)
        return token_list;
    };
    parser.prototype.build_operator = function (branch) {
        //Look for the root operator
        var root_index = -1;
        var root_operator = 100;
        for (var i = 0; i < branch.length; i++) {
            if (branch[i].type === utils_1.utils.token.OPERATOR && branch[i].value < root_operator) {
                root_operator = branch[i].value;
                root_index = i;
            }
        }
        if (root_index === 0)
            throw ('Syntax error at ' + branch[root_index].start + ' : (sub)expression can not start by an operator');
        //if there is an operator in the branch => split in two subranches
        if (root_index > 0) {
            var left_hand = void 0;
            if (branch[root_index].value === utils_1.utils.operator.ASSIGN) {
                left_hand = this.build_definition(branch.slice(0, root_index));
            }
            else {
                left_hand = this.build_operator(branch.slice(0, root_index));
            }
            var right_hand = this.build_operator(branch.slice(root_index + 1));
            return {
                type: utils_1.utils.token.OPERATOR,
                value: branch[root_index].value,
                left_hand: left_hand,
                right_hand: right_hand
            };
        }
        //otherwise
        var first = branch[0];
        var size = branch.length;
        if (first.type === utils_1.utils.token.NUMBER) {
            if (size === 1) {
                return {
                    type: utils_1.utils.token.NUMBER,
                    value: first.value
                };
            }
            throw ('Syntax error after ' + first.start + ' : NUMBER can not be followed by ' + branch[1].type);
        }
        if (first.type === utils_1.utils.token.SYMBOL) {
            if (size === 1) {
                return {
                    type: utils_1.utils.token.SYMBOL,
                    name: first.name
                };
            }
            if (size === 2) {
                var second = branch[1];
                if (second.type === utils_1.utils.token.BLOCK) {
                    // it's a function
                    if (second.value === '(') {
                        var params = this.build_call_params(second.content);
                        return {
                            type: utils_1.utils.token.SYMBOL,
                            name: first.name,
                            is_function: true,
                            params: params
                        };
                    }
                    // it's an array
                    if (second.value === '[') {
                        // TODO: handle the array case
                    }
                    throw ('Syntax error after ' + first.start + ' : SYMBOL can not be followed by a ' + second.value + 'block');
                }
                throw ('Syntax error after ' + first.start);
            }
            throw ('Syntax error at ' + branch[2].start + ' : unexpected token here (Symbol should be followed by one or two token, no more)');
        }
        if (first.type === utils_1.utils.token.BLOCK) {
            if (first.value === '(') {
                return this.build_operator(first.content);
            }
            if (first.value === '[') {
                throw ('Syntax error at ' + first.start + ' : \'[\' is not expected here');
            }
        }
        if (first.type === utils_1.utils.token.LATEX) {
            var content_1 = [];
            first.content.forEach(function (c) {
                if (c.type === utils_1.utils.token.STRING) {
                    content_1.push({
                        type: utils_1.utils.token.STRING,
                        value: c.value
                    });
                }
                else if (c.type === utils_1.utils.token.SYMBOL) {
                    content_1.push({
                        type: utils_1.utils.token.SYMBOL,
                        name: c.name
                    });
                }
            });
            return {
                type: utils_1.utils.token.LATEX,
                content: content_1
            };
        }
        throw ('Syntax error at ' + first.start + '');
    };
    parser.prototype.build_call_params = function (branch) {
        var params = [];
        var first = [];
        for (var i = 0; i < branch.length; i++) {
            if (branch[i].type != utils_1.utils.token.SEPARATOR) {
                first.push(branch[i]);
            }
            else {
                if (first.length === 0) {
                    throw ('Syntax error at ' + branch[i].start + ' : missing parameter or two many \',\' .');
                }
                params.push(this.build_operator(first));
                first = [];
            }
        }
        if (first.length === 0) {
            throw ('Syntax error at ' + branch[branch.lenght - 1].start + ' : missing parameter or two many \',\' .');
        }
        params.push(this.build_operator(first));
        return params;
    };
    parser.prototype.build_def_params = function (branch) {
        var params = [];
        var waiting_for = utils_1.utils.token.SYMBOL;
        var i = 0;
        // _.jlog(branch)
        while (i < branch.length) {
            if (branch[i].type === utils_1.utils.token.SYMBOL) {
                params.push({
                    type: utils_1.utils.token.SYMBOL,
                    name: branch[i].name
                });
                i++;
                if (i < branch.length && branch[i].type !== utils_1.utils.token.SEPARATOR) {
                    throw ('Syntax error at ' + branch[i].start + ' : \',\' expected');
                }
            }
            else {
                throw ('Syntax error at ' + branch[i].start + ' : SYMBOL expected');
            }
            i++;
        }
        return params;
    };
    parser.prototype.build_definition = function (branch) {
        var first = branch[0];
        var size = branch.length;
        //variable case
        if (size === 1) {
            return {
                type: 'SYMBOL',
                name: first.name,
                is_const: first.is_const
            };
        }
        if (size === 2) {
            var second = branch[1];
            if (second.type !== utils_1.utils.token.BLOCK) {
                throw ('Syntax error at ' + second.start);
            }
            // function case
            if (second.value === '(') {
                var params = this.build_def_params(second.content);
                return {
                    type: utils_1.utils.token.SYMBOL,
                    name: first.name,
                    is_function: true,
                    is_const: first.is_const,
                    params: params
                };
            }
            // array case
            if (second.value === '[') {
                // TODO: handle the array case 
            }
        }
        throw ('Syntax error after ' + first.start + ' : No operator allowed on left hand of assignment');
    };
    parser.prototype.build_tree = function (token_list) {
        var t = new tree_1.tree();
        t.push(this.build_operator(token_list));
        //_.jlog(t)
        return t;
    };
    parser.prototype.parse = function (expr) {
        this.expr = expr;
        this.ptr = 0;
        var token_list = this.tokenize();
        var tree = this.build_tree(token_list);
        return tree;
    };
    return parser;
}());
exports.parser = parser;
