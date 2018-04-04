import { tree } from './tree';
import { scope } from './scope';
export declare class expression {
    private tree;
    private scope;
    value: any;
    name: string;
    is_assignment: boolean;
    constructor(scope: scope, tree: tree);
    compile(): void;
    _compile(root: any): any;
    _compile_func(root: any, params: any): any;
    compile_symbol_def(root: any): any;
    destroy(): void;
}
