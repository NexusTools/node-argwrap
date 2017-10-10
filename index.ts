/*
    Copied from http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript#answer-9924463
*/

var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function argnames(func: Function): string[]{
    var fnStr = func.toString().replace(STRIP_COMMENTS, '')
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
    if (result === null)
        return [];
    return result
}

var $break = new Object();
function argWrap0(func: Function, required?: string[], friendlyname?: string) {
    const names = argnames(func);
    const revNames = names.slice(0).reverse();
    const name = friendlyname || func['name'] || "anonymous";
    var source = "(function " + name.replace(/[^a-zA-Z0-9\_]/g, "_") + "_argwrap_mapper(argmap){";

    var _else = false;
    var until = revNames.length;
    try {
        if (until > 0) {
            revNames.forEach(function (name) {
                var isConstant = required && required.indexOf(name) != -1;

                if (!isConstant) {
                    if (_else)
                        source += "}else ";
                    else
                        _else = true;

                    source += "if(" + JSON.stringify(name) + " in argmap){";
                } else if (_else)
                    source += "}else{";
                source += "return [";

                var _and = false;
                for (var i = 0; i < until; i++) {
                    if (_and)
                        source += ",";
                    else
                        _and = true;
                    source += "argmap" + "." + names[i];
                }
                source += "];";
                if (isConstant)
                    throw $break;
                until--;
            });
            source += "}else{";
        }
        source += "return [];";
    } catch (e) {
        if (e !== $break)
            throw e;
    }
    if (_else)
        source += "}";
    source += "})";

    var mapper: (args: any) => any[];
    try {
        mapper = eval(source);
    } catch (e) {
        throw new Error("Failed to compile source: " + source);
    }
    return [function (args: any) {
        return func.apply(func, mapper(args));
    }, names];
}

function argWrap(func: Function, required?: string[], friendlyname?: string) {
    return argWrap0(func, required, friendlyname)[0];
}

export = argWrap;
(argWrap as any).wrap0 = argWrap0;
(argWrap as any).names = argnames;
