"use strict";
exports.__esModule = true;
var tree = /** @class */ (function () {
    function tree() {
        this.root = [];
    }
    tree.prototype.push = function (branch) {
        this.root.push(branch);
    };
    return tree;
}());
exports.tree = tree;
