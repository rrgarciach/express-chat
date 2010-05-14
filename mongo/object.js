var Class = require(PATH_CLASS).Class;
var array_fill_keys = require(PATH_PHPJS).array_fill_keys;
var sys = require("sys");

var MongoObject = new Class({

  constructor: function(mongoCollection, id) {
    this.mongoCollection = mongoCollection;
    this.id = id;
    this.pairIndex = mongoCollection.getPairIndex(id);
  },

  set: function(field, data, callback) {
    var pair = {};
    pair[field] = data;
    this.mongoCollection.update(this.pairIndex, "$set", pair, callback);
  },

  setElement: function(key, field, data, callback) {
    Object.merge(key, this.pairIndex);
    sys.puts("mergeeee : "+JSON.stringify(key));
    var pair = {};
    pair[field] = data;
    this.mongoCollection.update(key, "$set", pair, callback);
  },

  add: function(field, data, callback) {
    var pair = {};
    pair[field] = data;
    this.mongoCollection.update(this.pairIndex, "$push", pair, callback);
  },

  append: function(field, data, callback) {
    var pair = {};
    pair[field] = data;
    this.mongoCollection.update(this.pairIndex, "$pushAll", pair, callback);
  },

  remove: function(field, data, callback) {
    var pair = {};
    pair[field] = data;
    this.mongoCollection.update(this.pairIndex, "$pull", pair, callback);
  },

  removeAll: function(field, data, callback) {
    var pair = {};
    pair[field] = data;
    this.mongoCollection.update(this.pairIndex, "$pullAll", pair, callback);
  },

  getData: function(callback) {
    this.mongoCollection.find(this.pairIndex, callback);
  },

  get: function(fields, callback) {
    var pairs = array_fill_keys(fields, 1);
    this.mongoCollection.find(this.pairIndex, pairs, function(err, data) {
       callback(null, data);
    });
  },

  getSlice: function(field, start, callback) {
    //var query = {};
    //query[field] = {$slice: [start, 200]};
    //this.mongoCollection.find(this.pairIndex, query, callback);
    this.get([field], function(err, data) {
      var arr = data[field];
      if(data && arr && arr.length > start)
        callback(null, arr.slice(start));
      else
        callback(err, null);
    });
  },

  empty: function(field, isarray, callback) {
    if(callback == null) { callback = isarray; isarray = true; }
    var pair = {};
    pair[field] = (isarray) ? [] : {};
    this.mongoCollection.update(this.pairIndex, "$set", pair, callback);
  },

  exist: function(callback) {
    this.mongoCollection.contains(this.pairIndex, callback);
  },

  contains: function(field, value, callback) {
    var pair = {};
    pair[field] = value;
    Object.merge(pair, this.pairIndex);
    this.mongoCollection.find(pair, function(err, cursor) {
      cursor.count(function(err, n) {
        callback(err, n > 0);
      });
    });
  },

  getDb: function() {
    return this.mongoCollection.getDb();
  }

});

exports.MongoObject = MongoObject;

