'use strict';

var base64url = require('base64url-universal');
var helpers = require('./helpers.js');
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

var base64url__namespace = /*#__PURE__*/_interopNamespaceDefault(base64url);

/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
 */

const LEGACY_SECRET_KEY_SIZE = constants.SECRET_KEY_SIZE + constants.PUBLIC_KEY_SIZE;

async function exportKeyPair({
  keyPair, secretKey, publicKey, includeContext, canonicalize = false
} = {}) {
  if(!(publicKey || secretKey)) {
    throw new TypeError(
      'Export requires specifying either "publicKey" or "secretKey".');
  }

  const useSecretKey = secretKey && !!keyPair.secretKey;

  // export as Multikey
  const exported = {};
  if(includeContext) {
    exported['@context'] = constants.MULTIKEY_CONTEXT_V1_URL;
  }
  exported.id = keyPair.id;
  exported.type = 'Multikey';
  exported.controller = keyPair.controller;

  if(publicKey) {
    exported.publicKeyMultibase = rawToPublicKeyMultibase(keyPair);
  }
  if(useSecretKey) {
    exported.secretKeyMultibase = rawToSecretKeyMultibase({
      ...keyPair, canonicalize
    });
  }

  if(keyPair.revoked) {
    exported.revoked = keyPair.revoked;
  }

  return exported;
}

async function importKeyPair({
  id, controller, secretKeyMultibase, publicKeyMultibase, revoked
}) {
  if(!publicKeyMultibase) {
    throw new TypeError('The "publicKeyMultibase" property is required.');
  }

  const {
    publicKey, secretKey
  } = helpers.mbDecodeKeyPair({publicKeyMultibase, secretKeyMultibase});

  if(controller && !id) {
    id = `${controller}#${publicKeyMultibase}`;
  }

  return {
    id,
    controller,
    publicKey,
    secretKey,
    publicKeyMultibase,
    secretKeyMultibase,
    revoked,
  };
}

function jwkToPublicKeyBytes({jwk} = {}) {
  const {kty, crv, x} = jwk;
  if(kty !== 'OKP') {
    throw new TypeError('"jwk.kty" must be "OKP".');
  }
  if(crv !== 'Ed25519') {
    throw new TypeError('"jwk.crv" must be "Ed25519".');
  }
  if(typeof x !== 'string') {
    throw new TypeError('"jwk.x" must be a string.');
  }
  const publicKey = base64url__namespace.decode(jwk.x);
  if(publicKey.length !== constants.PUBLIC_KEY_SIZE) {
    throw new Error(
      `Invalid public key size (${publicKey.length}); ` +
      `expected ${constants.PUBLIC_KEY_SIZE}.`);
  }
  return publicKey;
}

function jwkToPublicKeyMultibase({jwk} = {}) {
  const publicKey = jwkToPublicKeyBytes({jwk});
  const {publicKeyMultibase} = helpers.mbEncodeKeyPair({
    keyPair: {publicKey}
  });
  return publicKeyMultibase;
}

function jwkToSecretKeyBytes({jwk} = {}) {
  const {kty, crv, d} = jwk;
  if(kty !== 'OKP') {
    throw new TypeError('"jwk.kty" must be "OKP".');
  }
  if(crv !== 'Ed25519') {
    throw new TypeError('"jwk.crv" must be "Ed25519".');
  }
  if(typeof d !== 'string') {
    throw new TypeError('"jwk.d" must be a string.');
  }
  const secretKey = Uint8Array.from(base64url__namespace.decode(jwk.d));
  if(secretKey.length !== constants.SECRET_KEY_SIZE) {
    throw new Error(
      `Invalid secret key size (${secretKey.length}); ` +
      `expected ${constants.SECRET_KEY_SIZE}.`);
  }
  return secretKey;
}

function jwkToSecretKeyMultibase({jwk} = {}) {
  const secretKey = jwkToSecretKeyBytes({jwk});
  const {secretKeyMultibase} = helpers.mbEncodeKeyPair({
    keyPair: {secretKey}
  });
  return secretKeyMultibase;
}

function rawToPublicKeyMultibase({publicKey} = {}) {
  if(publicKey.length !== constants.PUBLIC_KEY_SIZE) {
    throw new Error(
      `Invalid public key size (${publicKey.length}); ` +
      `expected ${constants.PUBLIC_KEY_SIZE}.`);
  }
  const {publicKeyMultibase} = helpers.mbEncodeKeyPair({
    keyPair: {publicKey}
  });
  return publicKeyMultibase;
}

function rawToSecretKeyMultibase({
  secretKey, canonicalize = false
} = {}) {
  if(secretKey.length !== constants.SECRET_KEY_SIZE) {
    if(secretKey.length !== LEGACY_SECRET_KEY_SIZE) {
      throw new Error(
        `Invalid secret key size (${secretKey.length}); ` +
        `expected ${constants.SECRET_KEY_SIZE}.`);
    }
    // handle legacy concatenated (secret key + public key)
    if(canonicalize) {
      secretKey = secretKey.subarray(0, constants.SECRET_KEY_SIZE);
    }
  }
  const {secretKeyMultibase} = helpers.mbEncodeKeyPair({
    keyPair: {secretKey}
  });
  return secretKeyMultibase;
}

exports.exportKeyPair = exportKeyPair;
exports.importKeyPair = importKeyPair;
exports.jwkToPublicKeyBytes = jwkToPublicKeyBytes;
exports.jwkToPublicKeyMultibase = jwkToPublicKeyMultibase;
exports.jwkToSecretKeyBytes = jwkToSecretKeyBytes;
exports.jwkToSecretKeyMultibase = jwkToSecretKeyMultibase;
exports.rawToPublicKeyMultibase = rawToPublicKeyMultibase;
exports.rawToSecretKeyMultibase = rawToSecretKeyMultibase;
