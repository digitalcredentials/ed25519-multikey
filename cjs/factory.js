'use strict';

var ed25519 = require('./ed25519.js');

/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

const ALGORITHM = 'Ed25519';

function createSigner({id, secretKey}) {
  if(!secretKey) {
    throw new Error('A secret key is not available for signing.');
  }
  return {
    algorithm: ALGORITHM,
    id,
    async sign({data}) {
      return ed25519.sign(secretKey, data);
    },
  };
}

function createVerifier({id, publicKey}) {
  if(!publicKey) {
    throw new Error('A public key is not available for verifying.');
  }
  return {
    algorithm: ALGORITHM,
    id,
    async verify({data, signature}) {
      return ed25519.verify(publicKey, data, signature);
    },
  };
}

exports.createSigner = createSigner;
exports.createVerifier = createVerifier;
