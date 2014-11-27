var assert = require('assert');
var path = require('path');

var argwrap;
var topDir = path.dirname(__dirname);
it('index.js', function(){
    argwrap = require(path.resolve(topDir, "index"));
});
describe('argwrap', function() {
    function test(hello, kπtty, dog, $master, oranges) {
        return hello*3 + kπtty*5 + ((dog || 5) + ($master || 0) - (oranges || 0));
    }
    it('check argument names', function(){
        assert.equal(JSON.stringify(argwrap.names(test)),
                     JSON.stringify(["hello", "kπtty", "dog", "$master", "oranges"]));
    });
    it('with constants', function(){
        var wrapped = argwrap(test, ["hello", "kπtty", "dog", "$master", "oranges"]);
        assert.equal(wrapped({
            hello: 1,
            kπtty: 0.5,
            dog: 12,
            $master: 45,
            oranges: 100
        }), -37.5);
    });
    it('with some constants', function(){
        var wrapped = argwrap(test, ["hello", "kπtty", "$master"]);
        assert.equal(wrapped({
            hello: 1,
            kπtty: 0.5,
            dog: 12,
            $master: 45,
            oranges: 100
        }), -37.5);
    });
    it('with some constants and some values', function(){
        var wrapped = argwrap(test, ["hello", "kπtty", "$master"]);
        assert.equal(wrapped({
            hello: 1,
            kπtty: 0.5,
            $master: 45
        }), 55.5);
    });
    it('only 2 start arguments', function(){
        var wrapped = argwrap(test, ["hello"]);
        assert.equal(wrapped({
            hello: 1,
            kπtty: 0.3
        }), 9.5);
    });
    it('invalid arguments', function(){
        var wrapped = argwrap(test);
        assert.equal(wrapped({
            tuna: false,
            horse: "farmer"
        }) + "", "NaN");
    });
});
