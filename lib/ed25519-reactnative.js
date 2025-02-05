import * as ed25519 from '@stablelib/ed25519'
import * as Crypto from 'expo-crypto';
// import 'fast-text-encoding';

async function sha256digest({ data }) {
    return Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data);
}

export default {
    ...ed25519,
    sha256digest
}
