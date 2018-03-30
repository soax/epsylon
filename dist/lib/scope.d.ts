import { expression } from './expression';
export declare class scope {
    symbol: any[];
    dependency: any[];
    constructor();
    eval(expr: string): expression;
    compile(expr: string): expression;
    destroy(e: expression): void;
    define(name: any, e: expression): void;
    is_defined(name: string): any;
    get_value_of(name: string): any;
    add_dependency_to(name: string, e: expression): void;
    update_dependency_of(name: string): void;
}
