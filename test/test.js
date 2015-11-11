chai.should();

describe("Storage", function(){

    describe("#setItem()", function(){
       it("should return true when the value is set", function(){
           Storage.setItem("name-1", "value-1").should.equal(true);
           Storage.setItem("name-2", "value-2", 3600*1000).should.equal(true);
           Storage.setItem("name-3", {
               "name-3-1": "value-3-1",
               "name-3-2": "value-3-2"
           }).should.equal(true);
           Storage.setItem({
               "name-4-1": "value-4-1",
               "name-4-2": "value-4-2"
           }).should.equal(true);
           Storage.setItem("name-5").should.equal(false);
       });
    });

    describe("#getItem()", function(){
        it("should return the result when get the value", function(){
            Storage.getItem("name-1").should.equal("value-1");
            Storage.getItem("name-2").should.equal("value-2");
            Storage.getItem("name-3")["name-3-1"].should.equal("value-3-1");
            Storage.getItem("name-3")["name-3-2"].should.equal("value-3-2");
            Storage.getItem("name-4-1").should.equal("value-4-1");
            Storage.getItem("name-4-2").should.equal("value-4-2");
            Storage.getItem().should.equal(false);
        });
    });

    describe("#removeItem()", function(){
        it("should return true when the value is removed", function(){
            Storage.removeItem("name-1").should.equal(true);
            Storage.removeItem("name-2").should.equal(true);
            Storage.removeItem("name-3").should.equal(true);
            Storage.removeItem("name-4-1").should.equal(true);
            Storage.removeItem("name-4-2").should.equal(true);
            Storage.removeItem().should.equal(false);
        });
    });

});