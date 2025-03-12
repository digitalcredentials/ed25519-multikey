'use strict';

var base58btc = require('base58-universal');
var constants = require('./constants.js');
var helpers = require('./helpers.js');

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
 * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
 */

const keyPairTranslationMap = new Map([
  ['Ed25519VerificationKey2020', {
    contextUrl: constants.ED25519_SIGNATURE_2020_V1_URL,
    translationFn: _translateEd25519VerificationKey2020
  }],
  ['Ed25519VerificationKey2018', {
    contextUrl: constants.ED25519_SIGNATURE_2018_V1_URL,
    translationFn: _translateEd25519VerificationKey2018
  }]
]);

async function _translateEd25519VerificationKey2020({keyPair}) {
  return {
    ...keyPair,
    type: 'Multikey',
    '@context': constants.MULTIKEY_CONTEXT_V1_URL,
    secretKeyMultibase: keyPair.privateKeyMultibase
  };
}

async function _translateEd25519VerificationKey2018({keyPair}) {
  const key = {
    publicKey: base58btc__namespace.decode(keyPair.publicKeyBase58),
    secretKey: undefined
  };

  if(keyPair.privateKeyBase58) {
    key.secretKey = base58btc__namespace.decode(keyPair.privateKeyBase58);
  }

  const {publicKeyMultibase, secretKeyMultibase} = helpers.mbEncodeKeyPair({
    keyPair: key
  });

  return {
    '@context': constants.MULTIKEY_CONTEXT_V1_URL,
    id: keyPair.id,
    type: 'Multikey',
    controller: keyPair.controller,
    revoked: keyPair.revoked,
    publicKeyMultibase,
    secretKeyMultibase,
  };
}

exports.keyPairTranslationMap = keyPairTranslationMap;
