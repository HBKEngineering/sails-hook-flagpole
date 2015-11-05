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


/// note that we're not actually serializing errors here properly, so the methods normally assigned (except for topLevelLinks and meta) don't work quite yet
// @todo write serialization code for errors (ErrorSerializerUtils)

  function error() {
    payload.errors = [];

    if (_.isArray(records)) {
      records.forEach(function (record) {
        payload.errors.push(record);

      });
    } else {
      payload.errors.push(records);
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

 if (opts.topLevelLinks) {
    payload.links = getLinks(opts.topLevelLinks);
  }

  if (opts.meta) {
    payload.meta = opts.meta;
  }


  if (collectionName == 'errors' || collectionName == 'error'){
    return error(records);
  }

 
  if (_.isArray(records)) {
    return collection(records);
  } else {
    return resource(records);
  }


};
