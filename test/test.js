//var should = chai.should();
var assert = chai.assert;

describe("Storage", function(){

    describe("#setItem()", function(){
       it("should return true when the value is set", function(){
           assert.equal(Storage.setItem("name-1", "value-1"), true);
           assert.equal(Storage.setItem("name-2", "value-2", 3600*1000), true);
           assert.equal(Storage.setItem("name-3", {
               "name-3-1": "value-3-1",
               "name-3-2": "value-3-2"
           }), true);
           assert.equal(Storage.setItem({
               "name-4-1": "value-4-1",
               "name-4-2": "value-4-2"
           }), true);
           assert.equal(Storage.setItem("name-5"), false);
       });
    });

    describe("#getItem()", function(){
        it("should return the result when get the value", function(){
            assert.equal(Storage.getItem("name-1"), "value-1");
            assert.equal(Storage.getItem("name-2"), "value-2");
            assert.typeOf(Storage.getItem("name-3"), "object");
            assert.equal(Storage.getItem("name-3")["name-3-1"], "value-3-1");
            assert.equal(Storage.getItem("name-3")["name-3-2"], "value-3-2");
            assert.equal(Storage.getItem("name-4-1"), "value-4-1");
            assert.equal(Storage.getItem("name-4-2"), "value-4-2");
            assert.equal(Storage.getItem("name-5"), null);
            assert.equal(Storage.getItem(), false);
        });
    });

    describe("#removeItem()", function(){
        it("should return true when the value is removed", function(){
            assert.equal(Storage.removeItem("name-1"), true);
            assert.equal(Storage.removeItem("name-2"), true);
            assert.equal(Storage.removeItem("name-3"), true);
            assert.equal(Storage.removeItem("name-4-1"), true);
            assert.equal(Storage.removeItem("name-4-2"), true);
            assert.equal(Storage.removeItem(), false);
        });
    });

    describe("#setCookie()", function(){
       it("should return true when the value is set", function(){
           assert.equal(Storage.setCookie("name-1", "value-1"), true);
           assert.equal(Storage.setCookie("name-2", "value-2", {
               "expires": 3600*1000,
               "path": "/"
           }), true);
           assert.equal(Storage.setCookie({
               "name-3-1": "value-3-1",
               "name-3-2": "value-3-2"
           }, {
               "expires": 3600*1000
           }), true);
           assert.equal(Storage.setCookie("name-4", "value-4", {
               "path": "/path-not-reachable"
           }), true);
           assert.equal(Storage.setCookie("name-5"), false);
           assert.equal(Storage.setCookie(), false);
       });
    });

    describe("#getCookie()", function(){
        it("should return the result when get the value", function(){
            assert.equal(Storage.getCookie("name-1"), "value-1");
            assert.equal(Storage.getCookie("name-2"), "value-2");
            assert.equal(Storage.getCookie("name-3-1"), "value-3-1");
            assert.equal(Storage.getCookie("name-3-2"), "value-3-2");
            assert.equal(Storage.getCookie("name-4"), false);
            assert.equal(Storage.getCookie("name-5"), false);
            assert.equal(Storage.getCookie(), false);
        });
    });

    describe("#removeCookie()", function(){
       it("should return true when the value is removed", function(){
           assert.equal(Storage.removeCookie("name-1"), true);
           assert.equal(Storage.removeCookie("name-2"), true); //其实是无法删除父路径上的cookie
           assert.equal(Storage.removeCookie("name-3-1"), true);
           assert.equal(Storage.removeCookie("name-3-2"), true);
           assert.equal(Storage.removeCookie("name-4"), true);
           assert.equal(Storage.removeCookie("name-5"), true);
           assert.equal(Storage.removeCookie(), false);
       });
    });

});