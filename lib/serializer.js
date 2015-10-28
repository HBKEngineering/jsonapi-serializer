'use strict';
var _ = require('lodash');
var SerializerUtils = require('./serializer-utils');

module.exports = function (collectionName, records, opts) {
  var payload = {};

  function getLinks(links) {
    return _.mapValues(links, function (value) {
      if (_.isFunction(value)) {
        return value(records);
      } else {
        return value;
      }
    });
  }

  function error() {
    payload.errors = [];

    if (_.isArray(records)) {
      records.forEach(function (record) {
      var serializerUtils = new SerializerUtils(collectionName, record, payload, opts);
        payload.errors.push(serializerUtils.perform());
      });
    } else {
      payload.errors = new SerializerUtils(collectionName, records, payload, opts).perform(records);
    }

    return payload;
  }


  function collection() {
    payload.data = [];

    records.forEach(function (record) {
      var serializerUtils = new SerializerUtils(collectionName, record,
        payload, opts);
      payload.data.push(serializerUtils.perform());
    });

    return payload;
  }

  function resource() {
    payload.data = new SerializerUtils(collectionName, records, payload, opts)
      .perform(records);

    return payload;
  }


// if block to determine what to process 

  if (collectionName == 'errors'){
    return error(record);
  }

  if (opts.topLevelLinks) {
    payload.links = getLinks(opts.topLevelLinks);
  }

  if (opts.meta) {
    payload.meta = opts.meta;
  }

  if (_.isArray(records)) {
    return collection(records);
  } else {
    return resource(records);
  }

  
};
