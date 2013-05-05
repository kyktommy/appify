/*******
 * 
 * Appify - client-side mvc framework for SPA
 * 
 * Author: Kwan Yu Kit Tommy
 *
 *******/

(function($, window, document, undefined) {

// Namespace
var Appify = window.Appify = {};

// Singleton application
var Application = Appify.Application = function() {
   
};

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
  child.prototype = new Proxy();

  // Add custom prototype (instance method to child
  if(protoProps) { $.extend(child.prototype, protoProps); }

  // Record the parent is the parent of child
  // child.__super__ = parent.prototype;

  return child;
};

/* *
 *
 * Event 
 *
 * */

var Event = Appify.Event = {
 
  // Register Events
  on: function(name, callback) {
    if(!this._events) { this._events = {}; }
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
    // No events -> return
    if (!this._events) { return this; }
    var event = this._events[attr];
    if(event) { this.trigger(event); }
    var all = this._events.all;
    if(all) { this.trigger(all); }
  }

};

/* *
 *
 * Model
 *
 * */

var Model = Appify.Model = function(protoProps) {
  var self = this,
      defaults = {
        attributes: {},
        events: {}
      };
  $.extend(this, defaults, protoProps, Event);

  // Set attributes
  var attrs = protoProps || {};
  this.set(attrs);
  
  // Listen to custom events
  $.each( this.events, function(name, callback) {
    self.on(name, callback);
  });
};

// Model instance methods
Model.prototype = {
  get: function(attr) {
    return this.attributes[attr];
  },

  set: function(attr, value) {
    if (attr == null) { return this; }

    var attrs,
        self = this;
    if (typeof attr === 'object') {
      attrs = attr;
    }
    else {
      attrs = {};
      attrs[attr] = value;
    }
    $.extend(this.attributes, attrs);
    $.extend(this, attrs);
    $.each(attrs, function(key, val) {
      self.triggerEvent(key);
    });
    return this;
  }
};

// Add `extend` module to Model
Model.extend = extend;

/* *
 *
 * Collection
 *
 * */

// Constructor
var Collection = Appify.Collection = function(protoProps) {
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

//Collection instance methods
Collection.prototype = { 

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
        className: '',
        id: '',
        events : [],
        template: function() { return _getSource(); }
      };

  $.extend(this, defaults, protoProps, Event);

  this.$el = $('<'+this.el+' class="'+this.className+'" id="'+this.id+'"></'+this.el+'>');

  // Register Events using JQuery Events
  $.each(this.events, function(name, callback) {
    var split = name.split(' '),
        eventName = split[0],
        selector = split.slice(1).join(' ');

    if(selector === '') {
      // bind event to self element
      self.$el.on(eventName, callback);
    }
    else {
      // bind event to selector
      self.$el.on(eventName, selector, callback);
    }
  });
};

View.prototype = {

  render: function(data) {
    this.$el.html(this.template(data));
    return this;
  },

  getSource: function() {
    this.source = this._findTemplateFromHTML(this.templateName).html();
    return this.source;
  },

  _findTemplateFromHTML: function(templateName) {
    return $('script[type="text/xx-appify"][data-template-name="' + templateName + '"]');
  }
};

/* *
 *
 * Controller
 *
 * */
Appify.controllers = {};

var Controller = Appify.Controller = function(protoProps) {
  $.extend(this, protoProps);
  Appify.controllers[protoProps.name] = this;
};

/* *
 *
 * Router
 *
 * */

var Router = Appify.Router = function(protoProps) {
  var defaults = {
    routingTable: {}
  };
  $.extend(this, defaults, protoProps);

  var self = this;
  // Prevent default action in not http link
  $(document).on('click', 'a:not([href^="http"])', function(e) {
    e.preventDefault();
    var href = $(this).attr('href'),
        title = $(this).data('title');

    self.action(href, title);

    // History
    history.pushState({}, title , href);
  });

  // Controller action when back and forward history
  window.onpopstate = action(event);
};

Router.prototype = {
  action: function(title, href) {
    // lookup routing table 
    var action = self.routingTable[href].split('#'),
        controller = Appify.controllers[action[0]],
        method = controller[action[1]];

    // Execute the controller method
    method.apply(controller);
  }
};


/* *
 *
 * Binding
 *
 * */

var Map = Appify.Map = function() {
};

var Binding = Appify.Binding = function(fromPath, toPath) {
  var defaults = {
    oneWay: false,
    from: fromPath,
    to: toPath
  };

  $.extend(this, defaults);
};

})(jQuery, this, document);

