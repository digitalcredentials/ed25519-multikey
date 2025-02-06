import * as ed25519 from '@stablelib/ed25519'
import * as Crypto from 'expo-crypto';

export async function sha256digest({ data }) {
    return Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data);
}
export const verify = ed25519.verify
export const sign = ed25519.sign
export const generateKeyPair = ed25519.generateKeyPair
export const generateKeyPairFromSeed = ed25519.generateKeyPairFromSeed