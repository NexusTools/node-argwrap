interface ArgWrap {
    (func: Function, required?: string[], friendlyname?: string): Function;
    static wrap0(func: Function, required?: string[], friendlyname?: string): {[0]:Function,[1]:string[]};
    static names(func: Function): string[];
}
export = ArgWrap;
