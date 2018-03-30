"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var expression = /** @class */ (function () {
    function expression(scope, tree) {
        this.scope = scope;
        this.tree = tree;
        this.compile();
    }
    expression.prototype.compile = function () {
        var root = this.tree.root[0];
        if (root.type === utils_1.utils.token.OPERATOR && root.value === utils_1.utils.operator.ASSIGN) {
            var name_1 = root.left_hand.name;
            this.value = this.compile_symbol_def(root);
            this.scope.define(name_1, this);
        }
        else {
            this.value = this._compile(this.tree.root[0])();
        }
    };
    expression.prototype._compile = function (root) {
        var _this = this;
        switch (root.type) {
            case utils_1.utils.token.OPERATOR: {
                switch (root.value) {
                    case utils_1.utils.operator.CONCAT: {
                        var left_1 = this._compile(root.left_hand);
                        var right_1 = this._compile(root.right_hand);
                        return function () {
                            return left_1() + right_1();
                        };
                    }
                    case utils_1.utils.operator.PLUS: {
                        var left_2 = this._compile(root.left_hand);
                        var right_2 = this._compile(root.right_hand);
                        return function () {
                            return left_2() + right_2();
                        };
                    }
                    case utils_1.utils.operator.MINUS: {
                        var left_3 = this._compile(root.left_hand);
                        var right_3 = this._compile(root.right_hand);
                        return function () {
                            return left_3() - right_3();
                        };
                    }
                    case utils_1.utils.operator.TIMES: {
                        var left_4 = this._compile(root.left_hand);
                        var right_4 = this._compile(root.right_hand);
                        return function () {
                            return left_4() * right_4();
                        };
                    }
                    case utils_1.utils.operator.DIV: {
                        var left_5 = this._compile(root.left_hand);
                        var right_5 = this._compile(root.right_hand);
                        return function () {
                            return left_5() / right_5();
                        };
                    }
                    case utils_1.utils.operator.POW: {
                        var left_6 = this._compile(root.left_hand);
                        var right_6 = this._compile(root.right_hand);
                        return function () {
                            return Math.pow(left_6(), right_6());
                        };
                    }
                }
            }
            case utils_1.utils.token.SYMBOL: {
                var symbol_1 = root.name;
                // if symbol already defined on the scope
                if (this.scope.is_defined(symbol_1)) {
                    this.scope.add_dependency_to(symbol_1, this);
                    // it's a fuction
                    if (root.is_function) {
                        var par_1 = { params: [] };
                        for (var i = 0; i < root.params.length; i++) {
                            par_1.params[i] = this._compile(root.params[i]);
                        }
                        return function () {
                            return _this.scope.get_value_of(symbol_1).apply(par_1);
                        };
                    }
                    // it's a variable 
                    return function () {
                        return _this.scope.get_value_of(symbol_1);
                    };
                }
                // if undefined symbol
                if (root.is_function) {
                    // it'a predefined Maths function
                    if (Math[symbol_1]) {
                        var par_2 = [];
                        root.params.forEach(function (p) {
                            par_2.push(_this._compile(p));
                        });
                        return function () {
                            return utils_1.utils.run_predef_math_function(Math[symbol_1], par_2);
                        };
                    }
                }
                else {
                    return function () {
                        return symbol_1;
                    };
                }
            }
            case utils_1.utils.token.NUMBER: {
                return function () {
                    return root.value;
                };
            }
            case utils_1.utils.token.LATEX: {
                var content_1 = [];
                root.content.forEach(function (c) {
                    if (c.type === utils_1.utils.token.STRING) {
                        content_1.push(function () { return c.value; });
                    }
                    else if (c.type === utils_1.utils.token.SYMBOL) {
                        content_1.push(_this._compile(c));
                    }
                });
                return function () {
                    var res = '';
                    content_1.forEach(function (c) { return res += c(); });
                    return res;
                };
            }
        }
    };
    expression.prototype._compile_func = function (root, params) {
        var _this = this;
        switch (root.type) {
            case utils_1.utils.token.OPERATOR: {
                switch (root.value) {
                    case utils_1.utils.operator.PLUS: {
                        var left_7 = this._compile_func(root.left_hand, params);
                        var right_7 = this._compile_func(root.right_hand, params);
                        return function () {
                            return left_7.apply(this) + right_7.apply(this);
                        };
                    }
                    case utils_1.utils.operator.MINUS: {
                        var left_8 = this._compile_func(root.left_hand, params);
                        var right_8 = this._compile_func(root.right_hand, params);
                        return function () {
                            return left_8.apply(this) - right_8.apply(this);
                        };
                    }
                    case utils_1.utils.operator.TIMES: {
                        var left_9 = this._compile_func(root.left_hand, params);
                        var right_9 = this._compile_func(root.right_hand, params);
                        return function () {
                            return left_9.apply(this) * right_9.apply(this);
                        };
                    }
                    case utils_1.utils.operator.DIV: {
                        var left_10 = this._compile_func(root.left_hand, params);
                        var right_10 = this._compile_func(root.right_hand, params);
                        return function () {
                            return left_10.apply(this) / right_10.apply(this);
                        };
                    }
                    case utils_1.utils.operator.POW: {
                        var left_11 = this._compile_func(root.left_hand, params);
                        var right_11 = this._compile_func(root.right_hand, params);
                        return function () {
                            return Math.pow(left_11.apply(this), right_11.apply(this));
                        };
                    }
                }
            }
            case utils_1.utils.token.SYMBOL: {
                var symbol_2 = root.name;
                // if symbol is part of function parameters
                if (params.lastIndexOf(symbol_2) > -1) {
                    return function () {
                        return this[symbol_2]();
                    };
                }
                // if symbol already defined on the scope
                if (this.scope.is_defined(symbol_2)) {
                    this.scope.add_dependency_to(symbol_2, this);
                    if (root.is_function) {
                    }
                    else {
                        return function () {
                            return _this.scope.get_value_of(symbol_2);
                        };
                    }
                }
                // if undefined symbol
                if (root.is_function) {
                }
                else {
                    return function () {
                        return symbol_2;
                    };
                }
            }
            case utils_1.utils.token.NUMBER: {
                return function () {
                    return root.value;
                };
            }
        }
    };
    expression.prototype.compile_symbol_def = function (root) {
        var symbol = root.left_hand;
        var def = root.right_hand;
        // it's a function
        if (symbol.is_function) {
            var params_1 = [];
            symbol.params.forEach(function (p) {
                params_1.push(p.name);
            });
            var func_1 = this._compile_func(def, params_1);
            return function () {
                var _this = this;
                var par = [];
                var i = 0;
                symbol.params.forEach(function (p) {
                    par[p.name] = _this.params[i++];
                });
                return func_1.apply(par);
            };
        }
        var value = this._compile(def)();
        return value;
    };
    //Unsubscribe for all symbols in the scope
    expression.prototype.destroy = function () {
    };
    return expression;
}());
exports.expression = expression;
