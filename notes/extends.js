var Cat, Dog,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { 
    for (var key in parent) { 
      if (__hasProp.call(parent, key)) 
        child[key] = parent[key]; 
    } 

    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor(); 
    child.__super__ = parent.prototype; 
    return child; 
};

Dog = (function() {
  function Dog() {
    this.a = 0;
  }

  Dog.prototype.say = function() {
    return this.b = 0;
  };

  Dog.create = function() {
    return new Dog;
  };

  return Dog;

})();

Cat = (function(_super) {
  __extends(Cat, _super);

  function Cat() {
    this.name = 'cat';
  }

  return Cat;

})(Dog);

alert(Dog.create().a);