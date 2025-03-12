'use strict';

var base58btc = require('base58-universal');
var constants = require('./constants.js');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var base58btc__namespace = /*#__PURE__*/_interopNamespaceDefault(base58btc);

/*!
 * Copyright (c) 2020-2024 Digital Bazaar, Inc. All rights reserved.
 */

function mbEncodeKeyPair({keyPair}) {
  const result = {};
  if(keyPair.publicKey) {
    result.publicKeyMultibase = _encodeMbKey(
      constants.MULTICODEC_PUB_HEADER, keyPair.publicKey);
  }
  if(keyPair.secretKey) {
    result.secretKeyMultibase = _encodeMbKey(
      constants.MULTICODEC_PRIV_HEADER, keyPair.secretKey);
  }
  return result;
}

function mbDecodeKeyPair({publicKeyMultibase, secretKeyMultibase}) {
  if(!(publicKeyMultibase && typeof publicKeyMultibase === 'string' &&
  publicKeyMultibase[0] === 'z')) {
    throw new Error(
      '"publicKeyMultibase" must be a multibase, base58-encoded string.');
  }
  // remove multibase header
  const publicKeyMulticodec = base58btc__namespace.decode(publicKeyMultibase.substr(1));
  // remove multicodec header
  const publicKey = publicKeyMulticodec.slice(constants.MULTICODEC_PUB_HEADER.length);

  let secretKey;
  if(secretKeyMultibase) {
    if(!(typeof secretKeyMultibase === 'string' &&
    secretKeyMultibase[0] === 'z')) {
      throw new Error(
        '"secretKeyMultibase" must be a multibase, base58-encoded string.');
    }
    // remove multibase header
    const secretKeyMulticodec = base58btc__namespace.decode(secretKeyMultibase.substr(1));
    // remove multicodec header
    secretKey = secretKeyMulticodec.slice(constants.MULTICODEC_PRIV_HEADER.length);
  }

  return {
    publicKey,
    secretKey
  };
}

// encode a multibase base58-btc multicodec key
function _encodeMbKey(header, key) {
  const mbKey = new Uint8Array(header.length + key.length);

  mbKey.set(header);
  mbKey.set(key, header.length);

  return constants.MULTIBASE_BASE58BTC_HEADER + base58btc__namespace.encode(mbKey);
}

exports.mbDecodeKeyPair = mbDecodeKeyPair;
exports.mbEncodeKeyPair = mbEncodeKeyPair;
