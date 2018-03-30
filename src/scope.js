"use strict";
exports.__esModule = true;
var parser_1 = require("./parser");
var expression_1 = require("./expression");
var scope = /** @class */ (function () {
    function scope() {
        this.symbol = [];
        this.dependency = [];
    }
    scope.prototype.eval = function (expr) {
        var e = this.compile(expr);
        return e;
    };
    scope.prototype.compile = function (expr) {
        var p = new parser_1.parser();
        var tree = p.parse(expr);
        var e = new expression_1.expression(this, tree);
        return e;
    };
    scope.prototype.destroy = function (e) {
        e.destroy();
    };
    scope.prototype.define = function (name, e) {
        if (this.symbol[name]) {
            this.destroy(this.symbol[name]);
        }
        this.symbol[name] = e;
        this.update_dependency_of(name);
    };
    scope.prototype.is_defined = function (name) {
        return this.symbol[name] || false;
    };
    scope.prototype.get_value_of = function (name) {
        return this.symbol[name].value;
    };
    scope.prototype.add_dependency_to = function (name, e) {
        if (!this.dependency[name]) {
            this.dependency[name] = [];
            this.dependency[name].push(e);
        }
        else {
            if (this.dependency[name].indexOf(e) < 0) {
                this.dependency[name].push(e);
            }
        }
    };
    scope.prototype.update_dependency_of = function (name) {
        if (this.dependency[name]) {
            this.dependency[name].forEach(function (e) {
                e.compile();
            });
        }
    };
    return scope;
}());
exports.scope = scope;
