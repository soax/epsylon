import { tree } from './tree';
import { utils as _ } from './utils';
export declare class parser {
    ptr: number;
    expr: string;
    token_tree: any[];
    constructor();
    read_token(): {
        type: _.token;
        start: number;
        length: number;
        value: any;
    } | {
        type: _.token;
        start: number;
        length: number;
        name: string;
        is_const: boolean;
    } | {
        type: _.token;
        start: number;
        length: number;
        content: any[];
    };
    read_number(): {
        type: _.token;
        start: number;
        length: number;
        value: number;
    };
    read_operator(): {
        type: _.token;
        start: number;
        length: number;
        value: any;
    };
    read_symbol(cst_flag?: boolean): {
        type: _.token;
        start: number;
        length: number;
        name: string;
        is_const: boolean;
    };
    read_separator(): {
        type: _.token;
        start: number;
        length: number;
        value: string;
    };
    read_block(): {
        type: _.token;
        start: number;
        length: number;
        value: string;
        content: any[];
    };
    read_tex(): {
        type: _.token;
        start: number;
        length: number;
        content: any[];
    };
    tokenize(): any[];
    build_operator(branch: any): any;
    build_call_params(branch: any): any[];
    build_def_params(branch: any): any[];
    build_definition(branch: any): {
        type: string;
        name: any;
        is_const: any;
        is_function?: undefined;
        params?: undefined;
    } | {
        type: _.token;
        name: any;
        is_function: boolean;
        is_const: any;
        params: any[];
    };
    build_tree(token_list: any): tree;
    parse(expr: string): tree;
}
