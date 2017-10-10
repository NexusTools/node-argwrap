interface ArgWrap {
    (func: Function, required?: string[], friendlyname?: string): Function;
    wrap0(func: Function, required?: string[], friendlyname?: string): {[0]:Function,[1]:string[]};
    names(func: Function): string[];
}
export = ArgWrap;
