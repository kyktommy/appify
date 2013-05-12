// Use chai.js as assertion (should)
var should = chai.should();

// Testing the mocha test framework
describe('testing', function() {
  it('should be true when 1 == 1', function() {
    var a = 1;
    a.should.equal(1);
  });
});

/**
 * Framework Test 
 **/

describe('Initialize', function() {
  it('should required App.js', function() {
    window.Appify.should.be.a('object');
  });
});

/**
 * Model Test 
 **/
describe('Model',function() {

  // Create own User model by Model.extend
  var User = Appify.Model.extend({ 
    name: null,
    age: null,
    type: 'user',
    sayhi: function() {
      return this.name + " is " + this.age + " years old.";  
    }
  });

  describe('Default Model', function() {

    it('should have correct default attribute', function() { 
      var user = new User();
      user.type.should.equal('user');
    });
    
  });

  // Create user object from User Model
  var user = new User({
    name: 'john',
    age: 17,
    login: function() {
      return 'going to login';
    }
  });

  it('should extend function', function() {
    user.sayhi().should.equal('john is 17 years old.');
  });

  describe('#get', function() {
    it('should get correct model attribute', function() {
      user.get('name').should.equal('john');
      user.get('age').should.equal(17);
    });
  });

  describe('#set', function() {
    it('should set correct model attribute', function() {
      user.set('name', 'mary')
          .get('name').should.equal('mary');
    });
  });

});


/* * 
 * Event Test
 * */

describe('Event', function() { 

  describe('Model Event', function() {

    var all = false,
    change = false;
  var model = new Appify.Model({
    events: {
      'all': function() {
        all = true;
      },
      'name': function() {
        change = true;    
      }
    }
  }); 
  model.set('name', 'mary');

  it('should able to listen event', function() {
    model._events.should.property('all'); 
    model._events.should.property('name'); 
  });

  it('should trigger "all" event when any attribute is changed', function() {
    all.should.equal(true); 
  });

  it('should trigger "change" event when a attribute is changed', function() {
    change.should.equal(true); 
  });

  });
});

/* * 
 * Controller Test
 * */

describe('Collection', function() {
  
  var newModel = new Appify.Model({name: 'may'})
  var added, removed;

  var UserCollection = new Appify.Collection({
    contents: [
      new Appify.Model({ name: 'john' }),
      new Appify.Model({ name: 'mary' }),
      new Appify.Model({ name: 'peter' })
    ],
    events: {
      'add': function() {
        added = true;
      },
      'remove': function() {
        removed = true;
      }
    }
  });

  describe('contents', function() {
    it('should store correct number of models', function() { 
      UserCollection.contents.should.have.length(3);
    });
  });

  describe('#add', function() { 
    it('should able to add model to Collection', function() {
      UserCollection.add(newModel);
      UserCollection.contents.should.have.length(4);
    });
  });

  describe('#remove', function() {
    it('should able to remove model from Collection', function() {
      UserCollection.remove(newModel);
      UserCollection.contents.should.have.length(3);
    });

    it('should return the removed model', function() {
      UserCollection.add(newModel);
      UserCollection.remove(newModel).should.equal(newModel);
    });
  });

  describe('Collection Event', function() {
    it('should able to register events', function() {
      UserCollection._events.should.property('add');
      UserCollection._events.should.property('remove');
    });
    
    it('should trigger function when model is added', function() {
      added = false;
      UserCollection.add(newModel);
      added.should.equal(true);
    });

    it('should trigger function when model is removed', function() {
      removed = false; 
      UserCollection.remove(newModel);
      removed.should.equal(true);
    });
  });
});


/* * 
 * View Test
 * */

describe('View', function() {

  var self_clicked, clicked;
   
  var userView = new Appify.View({
    el: 'div',
    id: 'user',
    className: 'student',
    templateName: 'user',
    events: {
      'click': function() {
        self_clicked = true;
      },
      'click #submit': function() {
        clicked = true; 
      }
    }
  });

  describe('$el', function() {
    it('should have correct $el = el + id + class', function() {
      userView.$el.attr('class').should.equal('student');
      userView.$el.attr('id').should.equal('user');
    });
  });

  describe('View Event', function() {

    // Add Data to fixure
    var $el = userView.$el;
    $el.append($('<button id="submit"></button'));
    var $fixture = $('#fixture-1').append($el);

    it('should trigger function when element in view is clicked', function() {
       clicked = false;
       // Simulate click event
       $fixture.find('#submit').trigger('click'); 
       clicked.should.equal(true);
    });

    it('should trigger function when the view is clicked', function() {
      self_clicked = false;
      $el.trigger('click');
      self_clicked.should.equal(true);
    });

  });

  describe('template', function() {
    it('should get correct template from DOM', function() {
      var $template = $('script[type="text/xx-appify"][data-template-name="user"]');
      userView.getSource().should.equal($template.html());
    });

    it('should able to plug handlebars.js as template engine', function() {
      userView.template = Handlebars.compile(userView.getSource());
    });
  });

  describe('#render', function() {
    it('should render correct from template', function() {
      userView.template = Handlebars.compile(userView.getSource());
      var view = userView.render({name: 'hi'});
      view.$el.text().trim().should.equal('hi');
    });
  });

});

describe('Controller', function() {
  var UserController = new Appify.Controller({
    'name': "UserController",
    'index': function() {
      return "controller#index"; 
    }
  });

  it('should accept a list a functions', function() {
    UserController.index().should.equal("controller#index");
  });

  it('should contained in controllers list', function() {
    Appify.controllers["UserController"].name.should.equal("UserController");
  });
});

describe('Router', function() {
  var a = 0; 

  var UserController = new Appify.Controller({
    'name': "UserController",
    'index': function() {
      a = 1; 
    }
  });

  var router = new Appify.Router({
    routingTable: {
      '/users': 'UserController#index'
    }
  });

  it('should have added routes to routing table', function() {
    router.routingTable['/users'].should.equal('UserController#index'); 
  });

  it('should invoke controller method when trigger the route', function() {
    $('a#users').trigger('click');
    a.should.equal(1);
  });
});
