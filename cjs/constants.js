'use strict';

/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
 */

// Ed25519 Signature 2018 Context v1 URL
const ED25519_SIGNATURE_2018_V1_URL =
  'https://w3id.org/security/suites/ed25519-2018/v1';
// Ed25519 Signature 2020 Context v1 URL
const ED25519_SIGNATURE_2020_V1_URL =
  'https://w3id.org/security/suites/ed25519-2020/v1';
// multibase base58-btc header
const MULTIBASE_BASE58BTC_HEADER = 'z';
// multicodec ed25519-pub header as varint
const MULTICODEC_PUB_HEADER = new Uint8Array([0xed, 0x01]);
// multicodec ed25519-priv header as varint
const MULTICODEC_PRIV_HEADER = new Uint8Array([0x80, 0x26]);
// multikey context v1 url
const MULTIKEY_CONTEXT_V1_URL = 'https://w3id.org/security/multikey/v1';
// Ed25519 public key size in bytes
const PUBLIC_KEY_SIZE = 32;
// Ed25519 secret key size in bytes
const SECRET_KEY_SIZE = 32;

exports.ED25519_SIGNATURE_2018_V1_URL = ED25519_SIGNATURE_2018_V1_URL;
exports.ED25519_SIGNATURE_2020_V1_URL = ED25519_SIGNATURE_2020_V1_URL;
exports.MULTIBASE_BASE58BTC_HEADER = MULTIBASE_BASE58BTC_HEADER;
exports.MULTICODEC_PRIV_HEADER = MULTICODEC_PRIV_HEADER;
exports.MULTICODEC_PUB_HEADER = MULTICODEC_PUB_HEADER;
exports.MULTIKEY_CONTEXT_V1_URL = MULTIKEY_CONTEXT_V1_URL;
exports.PUBLIC_KEY_SIZE = PUBLIC_KEY_SIZE;
exports.SECRET_KEY_SIZE = SECRET_KEY_SIZE;
