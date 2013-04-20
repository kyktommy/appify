// class Dog : Pet 
// public Dog(string name, string breed)
function Dog(name, breed) {
    // think Dog : base(name) 
    Pet.call(this, name);
    this.getBreed = function() { return breed; };
    // Breed doesn’t change, obviously! It’s read only.
    // this.setBreed = function(newBreed) { name = newName; };
}

// this makes Dog.prototype inherits
// from Pet.prototype
Dog.prototype = new Pet();

// remember that Pet.prototype.constructor
// points to Pet. We want our Dog instances’
// constructor to point to Dog.
Dog.prototype.constructor = Dog;

// Now we override Pet.prototype.toString
Dog.prototype.toString = function() {
    return “This dog’s name is: “ + this.getName() + 
        “, and its breed is: “ + this.getBreed();
};
// end of class Dog

var dog = new Dog(“Buddy”, “Great Dane”);
// test the new toString()
alert(dog);

// Testing instanceof (similar to the is operator)
// (dog is Dog)? yes
alert(dog instanceof Dog);
// (dog is Pet)? yes
alert(dog instanceof Pet);
// (dog is Object)? yes
alert(dog instanceof Object);