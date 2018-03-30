export declare namespace utils {
    enum operator {
        CONCAT = 1,
        ASSIGN = 2,
        EQUAL = 3,
        PLUS = 4,
        MINUS = 5,
        TIMES = 6,
        DIV = 7,
        POW = 8,
    }
    function to_operator(c: string): any;
    function to_close(c: string): any;
    function is_operator(c: string): any;
    function is_space(c: string): any;
    function is_separator(c: string): any;
    function is_symbol_flag(c: string): any;
    function is_number(c: string): boolean;
    function is_symbol(c: string): boolean;
    function is_block(c: any): any;
    function is_tex(c: any): any;
    enum token {
        OPERATOR = 1,
        NUMBER = 2,
        SYMBOL = 3,
        BLOCK = 4,
        SEPARATOR = 5,
        LATEX = 6,
        STRING = 7,
    }
    function run_predef_math_function(f: any, par: any): any;
    function jstr(obj: any): string;
    let log: (message?: any, ...optionalParams: any[]) => void;
    function jlog(obj: any): void;
}
