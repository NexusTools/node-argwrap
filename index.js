/*
    Copied from http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript#answer-9924463
*/

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function argnames(func) {
	var fnStr = func.toString().replace(STRIP_COMMENTS, '')
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
	if(result === null)
		return [];
	return result
}

var $break = new Object();
var noescape = /^[a-z_\$][a-z_\-0-9\$]*$/i;
function argWrap0(func, required, friendlyname) {
    var names = argnames(func);
    var revNames = names.slice(0).reverse();
    var source = "(function " + (friendlyname || func.name || "anonymous") + "_argwrap_mapper(argmap){";

    var _else = false;
    var until = revNames.length;
    try {
        if(until > 0) {
            revNames.forEach(function(name) {
                var isConstant = required && required.indexOf(name) != -1;

                if(!isConstant) {
                    if(_else)
                        source += "}else ";
                    else
                        _else = true;

                    source += "if(" + JSON.stringify(name) + " in argmap){";
                } else if(_else)
                    source += "}else{";
                source += "return [";
                
                var _and = false;
                for(var i=0;i<until;i++) {
                    if(_and)
                        source += ",";
                    else
                        _and = true;
                    source += "argmap" + "." + names[i];
                }
                source += "];";
                if(isConstant)
                    throw $break;
                until--;
            });
            source += "}else{";
        }
        source += "return [];";
    } catch(e) {
        if(e !== $break)
            throw e;
    }
    if(_else)
        source += "}";
    source += "})";
    
    var mapper;
    try {
    	mapper = eval(source);
	} catch(e) {
		throw new Error("Failed to compile source: " + source);
	}
    return [function(arguments) {
        return func.apply(func, mapper(arguments));
    }, names];
}
function argWrap(func, required, friendlyname) {
    return argWrap0(func, required, friendlyname)[0];
}

module.exports = argWrap;
module.exports.wrap0 = argWrap0;
module.exports.names = argnames;
