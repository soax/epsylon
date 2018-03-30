"use strict";
exports.__esModule = true;
var utils;
(function (utils) {
    var operator;
    (function (operator) {
        operator[operator["CONCAT"] = 1] = "CONCAT";
        operator[operator["ASSIGN"] = 2] = "ASSIGN";
        operator[operator["EQUAL"] = 3] = "EQUAL";
        operator[operator["PLUS"] = 4] = "PLUS";
        operator[operator["MINUS"] = 5] = "MINUS";
        operator[operator["TIMES"] = 6] = "TIMES";
        operator[operator["DIV"] = 7] = "DIV";
        operator[operator["POW"] = 8] = "POW";
    })(operator = utils.operator || (utils.operator = {}));
    var _to_operator = {
        '+': operator.PLUS,
        '-': operator.MINUS,
        '*': operator.TIMES,
        '/': operator.DIV,
        '^': operator.POW,
        '=': operator.EQUAL,
        ':': operator.ASSIGN
    };
    function to_operator(c) {
        return _to_operator[c];
    }
    utils.to_operator = to_operator;
    var _is_operator = {
        '+': true,
        '-': true,
        '*': true,
        '/': true,
        '^': true,
        '=': true,
        ':': true
    };
    var _is_space = {
        ' ': true,
        '\t': true
    };
    var _is_separator = {
        ',': true
    };
    var _is_symbol_flag = {
        '#': true
    };
    var _is_block = {
        '(': true,
        '[': true,
        '{': true
    };
    var _is_block_close = {
        ')': true,
        ']': true,
        '}': true
    };
    var _open_close = {
        '(': ')',
        '[': ']',
        '{': '}',
        '"': '"'
    };
    function to_close(c) {
        return _open_close[c];
    }
    utils.to_close = to_close;
    var _is_tex = {
        '"': true
    };
    function is_operator(c) {
        return _is_operator[c] || false;
    }
    utils.is_operator = is_operator;
    function is_space(c) {
        return _is_space[c] || false;
    }
    utils.is_space = is_space;
    function is_separator(c) {
        return _is_separator[c] || false;
    }
    utils.is_separator = is_separator;
    function is_symbol_flag(c) {
        return _is_symbol_flag[c] || false;
    }
    utils.is_symbol_flag = is_symbol_flag;
    function is_number(c) {
        return (c >= '0' && c <= '9') || c === '-';
    }
    utils.is_number = is_number;
    function is_symbol(c) {
        return (c >= 'a' && c <= 'z');
    }
    utils.is_symbol = is_symbol;
    function is_block(c) {
        return _is_block[c] || false;
    }
    utils.is_block = is_block;
    function is_tex(c) {
        return _is_tex[c] || false;
    }
    utils.is_tex = is_tex;
    var token;
    (function (token) {
        token[token["OPERATOR"] = 1] = "OPERATOR";
        token[token["NUMBER"] = 2] = "NUMBER";
        token[token["SYMBOL"] = 3] = "SYMBOL";
        token[token["BLOCK"] = 4] = "BLOCK";
        token[token["SEPARATOR"] = 5] = "SEPARATOR";
        token[token["LATEX"] = 6] = "LATEX";
        token[token["STRING"] = 7] = "STRING";
    })(token = utils.token || (utils.token = {}));
    function run_predef_math_function(f, par) {
        var _par = [];
        par.forEach(function (p) {
            _par.push(p());
        });
        return f.call(null, _par);
    }
    utils.run_predef_math_function = run_predef_math_function;
    function jstr(obj) {
        return JSON.stringify(obj, null, 2);
    }
    utils.jstr = jstr;
    utils.log = console.log;
    function jlog(obj) {
        utils.log(jstr(obj));
    }
    utils.jlog = jlog;
})(utils = exports.utils || (exports.utils = {}));
