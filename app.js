/*******
 * 
 * Appify - mvc framework for client-side
 * 
 * Author: Kwan Yu Kit Tommy
 *
 *******/

(function($, window, document, undefined) {

// Namespace
var Appify = window.Appify = {};

// Extend
var extend = function(protoProps, staticProps) {
  var parent = this,
      child;

  // If user provided customer constructor for that class
  // else that class use parent constructor

  if( protoProps && protoProps.hasOwnProperty('constructor') ) {
    child = protoProps.constructor;
  }
  else {
    child = function() { return parent.apply(this, arguments); };
  }

  // Add custom & parent's static properties into class
  $.extend(child, parent, staticProps);

  // Inherit all prototype from parent except constructor
  var Proxy = function() { this.constructor = child; };
  Proxy.prototype = parent.prototype;
  child.prototype = new Proxy;

  // Add custom prototype (instance method to child
  if(protoProps) { $.extend(child.prototype, protoProps) }

  // Record the parent is the parent of child
  // child.__super__ = parent.prototype;

  return child;
}

/* *
 *
 * Event 
 *
 * */

var Event = Appify.Event = {
 
  // Register Events
  on: function(name, callback) {
    this._events || (this._events = {})
    var event = this._events[name] || (this._events[name] = []);
    event.push({callback: callback, name: name});
  },

  off: { /* unregister event */ },

  // Trigger Event
  trigger: function(event) {
    var args = Array.prototype.slice.call(arguments, 1);
    $.each(event, function(index, ev) {
      ev.callback.apply(this, args);
    });
  },

  triggerEvent: function(attr, value) {
    if (!this._events) return this;
    var event = this._events[attr];
    if(event) this.trigger(event);
    var all = this._events['all'];
    if(all) this.trigger(all);
  }

};

/* *
 *
 * Model
 *
 * */

// Create a new Model
// Usage: new Appify.Model()
var Model = Appify.Model = function(protoProps) {
  var self = this,
      defaults = {
        events: []
      };
  $.extend(this, defaults, protoProps, Event);
  
  // Listen to custom events
  $.each( this.events, function(name, callback) {
    self.on(name, callback);
  });
}

// Model instance methods
Model.prototype = {
  get: function(attr) {
    return this[attr];
  },

  set: function(attr, value) {
    this[attr] = value;
    this.triggerEvent(attr);
    return this[attr];
  },

};

// Add `extend` to Model
Model.extend = extend;

/* *
 *
 * Controller
 *
 * */

// Constructor
var Controller = Appify.Controller = function(protoProps) {
  var self = this;
  var defaults = {
    contents: [],
    events: []
  };
  $.extend(this, defaults, protoProps, Event);
  
  // Listen to custom events
  $.each( this.events, function(name, callback) {
    self.on(name, callback);
  });
};

//Controller instance methods
Controller.prototype = { 

  add: function(model) {
    this.contents.push(model);
    this.triggerEvent('add');
  },

  remove: function(model) {
    var removedModel = this.contents.splice(this.contents.indexOf(model), 1)[0];
    this.triggerEvent('remove');
    return removedModel;
  }

};


/* *
 *
 * View
 *
 * */

var View = Appify.View = function(protoProps) {
  var self = this,
      defaults = {
        el: 'div',
        class: '',
        id: '',
        events : [],
        template: function() { return _getSource(); }
      };
  $.extend(this, defaults, protoProps, Event);

  this.$el = $('<'+this.el+' class="'+this.class+'" id="'+this.id+'"></'+this.el+'>');

  // Register Events using JQuery Events
  $.each(this.events, function(name, callback) {
    var split = name.split(' '),
        eventName = split[0],
        selector = split.slice(1).join(' ');

    if(selector === '') {
      self.$el.on(eventName, callback);
    }
    else {
      self.$el.on(eventName, selector, callback);
    }
  });
}

View.prototype = {

  render: function(data) {
    this.$el.append(this.template(data));
    return this.$el;
  },

  getSource: function() {
    this.source = this._findTemplateFromHTML(this.templateName).html();
    return this.source;
  },

  _findTemplateFromHTML: function(templateName) {
    return $('script[type="text/xx-appify"][data-template-name="' + templateName + '"]');
  }
};

})(jQuery, this, document);

// TODO
//   Auto Ajax CRUD data
//   Routing
//   2 way binding
