'use strict';

var util = require('../../common');

function Path(pathProps, parent) {
  var props = parseProps(pathProps);
  this._ref = props.ref;
  this._alias = props.alias;
  this._dep = props.dep;
  this._parent = parent || null;
}

Path.prototype = {
  ref: function() { return this._ref; },
  reff: function() { return this.ref().ref(); },
  child: function(key) {
    //todo-dynamic-keys
    return new Path(this.reff().child(key), this);
  },
  normChild: function(key) {
    //todo-dynamic-keys
    return new Path([this.reff().child(key), this.name()], this);
  },
  hasDependency: function() {
    return this._dep !== null;
  },
  getDependency: function() {
    return this._dep;
  },
  url: function() { return this.reff().toString(); },
  name: function() { return this._alias; },
  id: function() { return this.reff().name(); },
  parent: function() { return this._parent; }
};

function parseProps(props) {
  var ref, alias, dep = null;
  if( util.isArray(props) ) {
    ref = props[0];
    alias = props[1];
    dep = props[2];
  }
  else {
    ref = props;
  }
  return {
    ref: ref, alias: alias||ref.name(), dep: parseDep(dep)
  };
}

function parseDep(dep) {
  if( dep ) {
    var parts = dep.split('.');
    return { path: parts[0], field: parts[1] };
  }
  return null;
}

module.exports = Path;