'use strict';

var base64url = require('base64url-universal');
var ed25519 = require('./ed25519.js');
var factory = require('./factory.js');
var serialize = require('./serialize.js');
var constants = require('./constants.js');
var helpers = require('./helpers.js');
var keyPairTranslator = require('./keyPairTranslator.js');

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

var base64url__namespace = /*#__PURE__*/_interopNamespaceDefault(base64url);

/*!
 * Copyright (c) 2020-2023 Digital Bazaar, Inc. All rights reserved.
 */

async function generate({id, controller, seed} = {}) {
  let key;
  if(seed) {
    key = await ed25519.generateKeyPairFromSeed(seed);
  } else {
    key = await ed25519.generateKeyPair();
  }

  const {publicKeyMultibase, secretKeyMultibase} = helpers.mbEncodeKeyPair({
    keyPair: key
  });
  if(controller && !id) {
    id = `${controller}#${publicKeyMultibase}`;
  }
  const keyPair = {
    id,
    controller,
    publicKeyMultibase,
    secretKeyMultibase,
    ...key,
  };
  return _createKeyPairInterface({keyPair});
}

// import key pair from JSON Multikey
async function from(key) {
  let multikey = {...key};
  if(multikey.type !== 'Multikey') {
    // attempt loading from JWK if `publicKeyJwk` is present
    if(multikey.publicKeyJwk) {
      let id;
      let controller;
      if(multikey.type === 'JsonWebKey' || multikey.type === 'JsonWebKey2020') {
        ({id, controller} = multikey);
      }
      return fromJwk({
        jwk: multikey.publicKeyJwk, secretKey: false, id, controller
      });
    }
    if(multikey.type) {
      multikey = await keyPairTranslator.toMultikey({keyPair: multikey});
      return _createKeyPairInterface({keyPair: multikey});
    }
  }
  if(!multikey.type) {
    multikey.type = 'Multikey';
  }
  if(!multikey['@context']) {
    multikey['@context'] = constants.MULTIKEY_CONTEXT_V1_URL;
  }

  _assertMultikey(multikey);
  return _createKeyPairInterface({keyPair: multikey});
}

// imports key pair from JWK
async function fromJwk({jwk, secretKey = false, id, controller} = {}) {
  const multikey = {
    '@context': constants.MULTIKEY_CONTEXT_V1_URL,
    type: 'Multikey',
    publicKeyMultibase: serialize.jwkToPublicKeyMultibase({jwk})
  };
  if(typeof id === 'string') {
    multikey.id = id;
  }
  if(typeof controller === 'string') {
    multikey.controller = controller;
  }
  if(secretKey && jwk.d) {
    multikey.secretKeyMultibase = serialize.jwkToSecretKeyMultibase({jwk});
  }
  return from(multikey);
}

// converts key pair to JWK
async function toJwk({keyPair, secretKey = false} = {}) {
  const jwk = {
    kty: 'OKP',
    crv: 'Ed25519',
    x: base64url__namespace.encode(keyPair.publicKey)
  };
  const useSecretKey = secretKey && !!keyPair.secretKey;
  if(useSecretKey) {
    jwk.d = base64url__namespace.encode(keyPair.secretKey);
  }
  return jwk;
}

async function _createKeyPairInterface({keyPair}) {
  if(!keyPair.publicKey) {
    keyPair = await serialize.importKeyPair(keyPair);
  }
  keyPair = {
    ...keyPair,
    async export({
      publicKey = true, secretKey = false, includeContext = true, raw = false,
      canonicalize = false
    } = {}) {
      if(raw) {
        const {publicKey, secretKey} = keyPair;
        const result = {};
        if(publicKey) {
          result.publicKey = publicKey.slice();
        }
        if(secretKey) {
          if(canonicalize && secretKey.length > constants.SECRET_KEY_SIZE) {
            result.secretKey = secretKey.subarray(0, constants.SECRET_KEY_SIZE).slice();
          } else {
            result.secretKey = secretKey;
          }
        }
        return result;
      }
      return serialize.exportKeyPair({
        keyPair, publicKey, secretKey, includeContext, canonicalize
      });
    },
    signer() {
      const {id, secretKey} = keyPair;
      return factory.createSigner({id, secretKey});
    },
    verifier() {
      const {id, publicKey} = keyPair;
      return factory.createVerifier({id, publicKey});
    }
  };

  return keyPair;
}

function _assertMultikey(key) {
  if(!(key && typeof key === 'object')) {
    throw new TypeError('"key" must be an object.');
  }
  if(key.type !== 'Multikey') {
    throw new Error('"key" must be a Multikey with type "Multikey".');
  }
  if(!(key['@context'] === constants.MULTIKEY_CONTEXT_V1_URL ||
    (Array.isArray(key['@context']) &&
    key['@context'].includes(constants.MULTIKEY_CONTEXT_V1_URL)))) {
    throw new TypeError(
      '"key" must be a Multikey with context ' +
      `"${constants.MULTIKEY_CONTEXT_V1_URL}".`);
  }
}

exports.from = from;
exports.fromJwk = fromJwk;
exports.generate = generate;
exports.toJwk = toJwk;
